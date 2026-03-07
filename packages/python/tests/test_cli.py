import json
import subprocess
import unittest
from unittest.mock import MagicMock, patch

from morphql import MorphQL


def _make_result(stdout: str = "", returncode: int = 0, stderr: str = "") -> MagicMock:
    m = MagicMock()
    m.stdout = stdout.encode()
    m.stderr = stderr.encode()
    m.returncode = returncode
    return m


class TestCliExecute(unittest.TestCase):
    @patch("subprocess.run")
    def test_execute_passes_query_flag(self, mock_run):
        mock_run.return_value = _make_result('{"ok": true}')
        result = MorphQL.execute("from json to json transform set x = x", '{"x":1}')
        args = mock_run.call_args[0][0]
        self.assertIn("-q", args)
        self.assertEqual(result, '{"ok": true}')

    @patch("subprocess.run")
    def test_execute_passes_data_flag(self, mock_run):
        mock_run.return_value = _make_result("result")
        MorphQL.execute("from json to json transform set x = x", {"key": "val"})
        args = mock_run.call_args[0][0]
        self.assertIn("-i", args)
        idx = args.index("-i")
        self.assertEqual(json.loads(args[idx + 1]), {"key": "val"})

    @patch("subprocess.run")
    def test_execute_none_data_sends_empty_object(self, mock_run):
        mock_run.return_value = _make_result("{}")
        MorphQL.execute("from json to json transform set x = x")
        args = mock_run.call_args[0][0]
        idx = args.index("-i")
        self.assertEqual(args[idx + 1], "{}")

    @patch("subprocess.run")
    def test_execute_raises_on_nonzero_exit(self, mock_run):
        mock_run.return_value = _make_result("", returncode=1, stderr="syntax error")
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute("bad query", "{}")
        self.assertIn("syntax error", str(ctx.exception))

    @patch("subprocess.run")
    def test_execute_file_passes_Q_flag(self, mock_run):
        mock_run.return_value = _make_result("ok")
        import tempfile, os
        with tempfile.NamedTemporaryFile(suffix=".morphql", delete=False, mode="w") as f:
            f.write("from json to json transform set x = x")
            path = f.name
        try:
            MorphQL.execute_file(path, "{}")
            args = mock_run.call_args[0][0]
            self.assertIn("-Q", args)
            self.assertIn(path, args)
        finally:
            os.unlink(path)

    def test_execute_file_raises_if_not_found(self):
        with self.assertRaises(FileNotFoundError):
            MorphQL.execute_file("/nonexistent/query.morphql")

    def test_execute_raises_if_query_empty(self):
        with self.assertRaises(ValueError):
            MorphQL.execute("")

    @patch("subprocess.run")
    def test_instance_run_uses_preset_defaults(self, mock_run):
        mock_run.return_value = _make_result("result")
        morph = MorphQL(provider="cli")
        morph.run("from json to json transform set x = x", "{}")
        self.assertTrue(mock_run.called)

    @patch("subprocess.run")
    def test_node_no_warnings_env_set(self, mock_run):
        mock_run.return_value = _make_result("ok")
        MorphQL.execute("from json to json transform set x = x", "{}")
        env = mock_run.call_args[1]["env"]
        self.assertEqual(env.get("NODE_NO_WARNINGS"), "1")


class TestCliRunFile(unittest.TestCase):
    @patch("subprocess.run")
    def test_run_file_passes_Q_flag(self, mock_run):
        mock_run.return_value = _make_result("ok")
        import tempfile, os
        with tempfile.NamedTemporaryFile(suffix=".morphql", delete=False, mode="w") as f:
            f.write("from json to json transform set x = x")
            path = f.name
        try:
            morph = MorphQL(provider="cli")
            morph.run_file(path, "{}")
            args = mock_run.call_args[0][0]
            self.assertIn("-Q", args)
            self.assertIn(path, args)
        finally:
            os.unlink(path)

    def test_run_file_raises_if_not_found(self):
        morph = MorphQL(provider="cli")
        with self.assertRaises(FileNotFoundError):
            morph.run_file("/nonexistent/query.morphql")

    def test_run_raises_if_query_empty(self):
        morph = MorphQL(provider="cli")
        with self.assertRaises(ValueError):
            morph.run("")


class TestCliErrorPaths(unittest.TestCase):
    @patch("subprocess.run")
    def test_timeout_raises_runtime_error(self, mock_run):
        mock_run.side_effect = subprocess.TimeoutExpired(cmd=["morphql"], timeout=30)
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute("from json to json transform set x = x", "{}")
        self.assertIn("timed out", str(ctx.exception))

    @patch("subprocess.run")
    def test_cli_not_found_raises_runtime_error(self, mock_run):
        mock_run.side_effect = FileNotFoundError()
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute(
                "from json to json transform set x = x",
                "{}",
                cli_path="/no/such/binary",
            )
        self.assertIn("not found", str(ctx.exception))

    @patch("subprocess.run")
    def test_stderr_preferred_over_stdout_on_error(self, mock_run):
        mock_run.return_value = _make_result("stdout msg", returncode=1, stderr="stderr msg")
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute("bad query", "{}")
        self.assertIn("stderr msg", str(ctx.exception))

    @patch("subprocess.run")
    def test_stdout_used_when_stderr_empty(self, mock_run):
        mock_run.return_value = _make_result("stdout only", returncode=1, stderr="")
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute("bad query", "{}")
        self.assertIn("stdout only", str(ctx.exception))


class TestConfigResolution(unittest.TestCase):
    @patch("subprocess.run")
    def test_env_var_used_as_fallback(self, mock_run):
        mock_run.return_value = _make_result("ok")
        import os
        saved = os.environ.pop("MORPHQL_CLI_PATH", None)
        os.environ["MORPHQL_CLI_PATH"] = "my-morphql-bin"
        try:
            MorphQL.execute("from json to json transform set x = x", "{}")
            args = mock_run.call_args[0][0]
            self.assertIn("my-morphql-bin", args)
        finally:
            del os.environ["MORPHQL_CLI_PATH"]
            if saved is not None:
                os.environ["MORPHQL_CLI_PATH"] = saved

    @patch("subprocess.run")
    def test_call_kwarg_overrides_instance_default(self, mock_run):
        """provider='server' kwarg must override instance default provider='cli'."""
        from unittest.mock import patch as mpatch

        mock_run.return_value = _make_result("should_not_be_called")
        response_mock = MagicMock()
        response_mock.read.return_value = json.dumps(
            {"success": True, "result": "server_result"}
        ).encode()
        response_mock.__enter__ = lambda s: s
        response_mock.__exit__ = MagicMock(return_value=False)

        morph = MorphQL(provider="cli")
        with mpatch("urllib.request.urlopen", return_value=response_mock):
            result = morph.run(
                "from json to json transform set x = x",
                "{}",
                provider="server",
            )
        self.assertEqual(result, "server_result")
        mock_run.assert_not_called()


if __name__ == "__main__":
    unittest.main()
