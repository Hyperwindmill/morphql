import json
import unittest
from io import BytesIO
from unittest.mock import MagicMock, patch

from morphql import MorphQL


def _make_response(body: dict, status: int = 200) -> MagicMock:
    raw = json.dumps(body).encode()
    m = MagicMock()
    m.read.return_value = raw
    m.status = status
    m.__enter__ = lambda s: s
    m.__exit__ = MagicMock(return_value=False)
    return m


class TestServerExecute(unittest.TestCase):
    @patch("urllib.request.urlopen")
    def test_execute_returns_result(self, mock_urlopen):
        mock_urlopen.return_value = _make_response({"success": True, "result": "hello"})
        result = MorphQL.execute(
            "from json to json transform set x = x",
            '{"x": 1}',
            provider="server",
        )
        self.assertEqual(result, "hello")

    @patch("urllib.request.urlopen")
    def test_payload_contains_query_and_data(self, mock_urlopen):
        mock_urlopen.return_value = _make_response({"success": True, "result": "ok"})
        MorphQL.execute(
            "from json to json transform set x = x",
            {"a": 1},
            provider="server",
        )
        req = mock_urlopen.call_args[0][0]
        payload = json.loads(req.data)
        self.assertEqual(payload["query"], "from json to json transform set x = x")
        self.assertEqual(payload["data"], {"a": 1})

    @patch("urllib.request.urlopen")
    def test_json_string_data_is_decoded(self, mock_urlopen):
        mock_urlopen.return_value = _make_response({"success": True, "result": "ok"})
        MorphQL.execute(
            "from json to json transform set x = x",
            '{"key": "value"}',
            provider="server",
        )
        req = mock_urlopen.call_args[0][0]
        payload = json.loads(req.data)
        self.assertEqual(payload["data"], {"key": "value"})

    @patch("urllib.request.urlopen")
    def test_api_key_header_sent(self, mock_urlopen):
        mock_urlopen.return_value = _make_response({"success": True, "result": "ok"})
        MorphQL.execute(
            "from json to json transform set x = x",
            "{}",
            provider="server",
            api_key="secret123",
        )
        req = mock_urlopen.call_args[0][0]
        self.assertEqual(req.get_header("X-api-key"), "secret123")

    @patch("urllib.request.urlopen")
    def test_raises_on_success_false(self, mock_urlopen):
        mock_urlopen.return_value = _make_response(
            {"success": False, "message": "bad query"}
        )
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute("bad", "{}", provider="server")
        self.assertIn("bad query", str(ctx.exception))

    @patch("urllib.request.urlopen")
    def test_uses_correct_endpoint(self, mock_urlopen):
        mock_urlopen.return_value = _make_response({"success": True, "result": "ok"})
        MorphQL.execute(
            "from json to json transform set x = x",
            "{}",
            provider="server",
            server_url="http://myhost:4000",
        )
        req = mock_urlopen.call_args[0][0]
        self.assertEqual(req.full_url, "http://myhost:4000/v1/execute")

    @patch("urllib.request.urlopen")
    def test_instance_run_server(self, mock_urlopen):
        mock_urlopen.return_value = _make_response({"success": True, "result": "done"})
        morph = MorphQL(provider="server", server_url="http://localhost:3000")
        result = morph.run("from json to json transform set x = x", "{}")
        self.assertEqual(result, "done")


class TestServerErrorPaths(unittest.TestCase):
    @patch("urllib.request.urlopen")
    def test_http_error_raises_runtime_error(self, mock_urlopen):
        import urllib.error
        err = urllib.error.HTTPError(
            url="http://localhost:3000/v1/execute",
            code=500,
            msg="Internal Server Error",
            hdrs=None,
            fp=BytesIO(b'{"message": "server crashed"}'),
        )
        mock_urlopen.side_effect = err
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute("from json to json transform set x = x", "{}", provider="server")
        self.assertIn("500", str(ctx.exception))

    @patch("urllib.request.urlopen")
    def test_url_error_raises_runtime_error(self, mock_urlopen):
        import urllib.error
        mock_urlopen.side_effect = urllib.error.URLError(reason="Connection refused")
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute("from json to json transform set x = x", "{}", provider="server")
        self.assertIn("unreachable", str(ctx.exception))

    @patch("urllib.request.urlopen")
    def test_invalid_json_response_raises_runtime_error(self, mock_urlopen):
        m = MagicMock()
        m.read.return_value = b"not json at all"
        m.__enter__ = lambda s: s
        m.__exit__ = MagicMock(return_value=False)
        mock_urlopen.return_value = m
        with self.assertRaises(RuntimeError) as ctx:
            MorphQL.execute("from json to json transform set x = x", "{}", provider="server")
        self.assertIn("invalid JSON", str(ctx.exception))

    @patch("urllib.request.urlopen")
    def test_run_file_via_server(self, mock_urlopen):
        mock_urlopen.return_value = _make_response({"success": True, "result": "file_result"})
        import tempfile, os
        with tempfile.NamedTemporaryFile(suffix=".morphql", delete=False, mode="w") as f:
            f.write("from json to json transform set x = x")
            path = f.name
        try:
            morph = MorphQL(provider="server")
            result = morph.run_file(path, "{}")
            self.assertEqual(result, "file_result")
            req = mock_urlopen.call_args[0][0]
            payload = json.loads(req.data)
            self.assertIn("from json", payload["query"])
        finally:
            os.unlink(path)


if __name__ == "__main__":
    unittest.main()
