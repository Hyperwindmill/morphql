"""
MorphQL Python Wrapper

A minimalist Python client for MorphQL — transform data with declarative queries.
Delegates execution to the MorphQL CLI or server via pluggable providers.

https://github.com/Hyperwindmill/morphql
License: MIT
Requires Python >= 3.8. No external dependencies.
"""

import json
import os
import platform
import subprocess
import tempfile
import urllib.error
import urllib.request
from typing import Any, Dict, Optional, Union


class MorphQL:
    PROVIDER_CLI = "cli"
    PROVIDER_SERVER = "server"

    RUNTIME_NODE = "node"
    RUNTIME_QJS = "qjs"

    _OPTION_DEFAULTS: Dict[str, Any] = {
        "provider": PROVIDER_CLI,
        "runtime": RUNTIME_NODE,
        "cli_path": "morphql",
        "node_path": "node",
        "qjs_path": None,
        "cache_dir": None,
        "server_url": "http://localhost:3000",
        "api_key": None,
        "timeout": 30,
    }

    _ENV_MAP: Dict[str, str] = {
        "provider": "MORPHQL_PROVIDER",
        "runtime": "MORPHQL_RUNTIME",
        "cli_path": "MORPHQL_CLI_PATH",
        "node_path": "MORPHQL_NODE_PATH",
        "qjs_path": "MORPHQL_QJS_PATH",
        "cache_dir": "MORPHQL_CACHE_DIR",
        "server_url": "MORPHQL_SERVER_URL",
        "api_key": "MORPHQL_API_KEY",
        "timeout": "MORPHQL_TIMEOUT",
    }

    def __init__(self, **defaults: Any) -> None:
        self._defaults = defaults

    # ------------------------------------------------------------------
    #  Public static API
    # ------------------------------------------------------------------

    @classmethod
    def execute(
        cls,
        query: str,
        data: Union[str, dict, list, None] = None,
        **options: Any,
    ) -> str:
        if not query:
            raise ValueError("MorphQL: 'query' is required")
        config = cls._resolve_config(options)
        return cls._dispatch(query, data, config)

    @classmethod
    def execute_file(
        cls,
        query_file: str,
        data: Union[str, dict, list, None] = None,
        **options: Any,
    ) -> str:
        cls._validate_query_file(query_file)
        config = cls._resolve_config(options)
        return cls._dispatch(None, data, config, query_file=query_file)

    # ------------------------------------------------------------------
    #  Public instance API
    # ------------------------------------------------------------------

    def run(
        self,
        query: str,
        data: Union[str, dict, list, None] = None,
        **options: Any,
    ) -> str:
        if not query:
            raise ValueError("MorphQL: 'query' is required")
        config = self._resolve_config(options, self._defaults)
        return self._dispatch(query, data, config)

    def run_file(
        self,
        query_file: str,
        data: Union[str, dict, list, None] = None,
        **options: Any,
    ) -> str:
        self._validate_query_file(query_file)
        config = self._resolve_config(options, self._defaults)
        return self._dispatch(None, data, config, query_file=query_file)

    # ------------------------------------------------------------------
    #  Dispatch
    # ------------------------------------------------------------------

    @classmethod
    def _dispatch(
        cls,
        query: Optional[str],
        data: Any,
        config: Dict[str, Any],
        query_file: Optional[str] = None,
    ) -> str:
        if config["provider"] == cls.PROVIDER_SERVER:
            return cls._execute_via_server(query, data, config, query_file)
        return cls._execute_via_cli(query, data, config, query_file)

    # ------------------------------------------------------------------
    #  CLI Provider
    # ------------------------------------------------------------------

    @classmethod
    def _execute_via_cli(
        cls,
        query: Optional[str],
        data: Any,
        config: Dict[str, Any],
        query_file: Optional[str] = None,
    ) -> str:
        data_str = cls._normalize_data(data)
        cache_dir = cls._resolve_cache_dir(config)
        cmd = cls._resolve_cli_command(config)

        if query_file is not None:
            args = cmd + ["-Q", query_file, "-i", data_str, "--cache-dir", cache_dir]
        else:
            args = cmd + ["-q", query, "-i", data_str, "--cache-dir", cache_dir]

        env = {**os.environ, "NODE_NO_WARNINGS": "1"}

        try:
            result = subprocess.run(
                args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env,
                timeout=int(config["timeout"]),
            )
        except FileNotFoundError:
            raise RuntimeError(
                f"MorphQL: CLI executable not found — {args[0]}"
            )
        except subprocess.TimeoutExpired:
            raise RuntimeError("MorphQL: CLI process timed out")

        if result.returncode != 0:
            stderr = result.stderr.decode(errors="replace").strip()
            stdout = result.stdout.decode(errors="replace").strip()
            msg = stderr if stderr else stdout
            raise RuntimeError(
                f"MorphQL CLI error (exit code {result.returncode}): {msg}"
            )

        return result.stdout.decode(errors="replace").strip()

    @classmethod
    def _resolve_cli_command(cls, config: Dict[str, Any]) -> list:
        if config["runtime"] == cls.RUNTIME_QJS:
            return cls._resolve_qjs_command(config)

        # 1. User-specified custom path
        if config["cli_path"] != "morphql":
            return [config["cli_path"]]

        # 2. Bundled morphql.js (next to this package)
        bundled = os.path.join(os.path.dirname(__file__), "..", "bin", "morphql.js")
        bundled = os.path.normpath(bundled)
        if os.path.isfile(bundled):
            return [config["node_path"], bundled]

        # 3. System-installed morphql binary
        return [config["cli_path"]]

    @classmethod
    def _resolve_qjs_command(cls, config: Dict[str, Any]) -> list:
        qjs_bin = config.get("qjs_path") or cls._maybe_install_qjs(config)

        # Locate the JS bundle
        bundle = os.path.normpath(
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "cli", "dist", "qjs", "qjs.js")
        )
        if not os.path.isfile(bundle):
            bundle = os.path.normpath(
                os.path.join(os.path.dirname(__file__), "..", "bin", "qjs.js")
            )
        if not os.path.isfile(bundle):
            raise RuntimeError(
                "MorphQL: QuickJS bundle not found. Run build:qjs or place it in bin/qjs.js"
            )

        return [qjs_bin, "--std", "-m", bundle]

    @classmethod
    def _maybe_install_qjs(cls, config: Dict[str, Any]) -> str:
        system = platform.system().lower()
        machine = platform.machine().lower()

        if "windows" in system:
            suffix = "-windows-x86_64.exe"
        elif "darwin" in system:
            suffix = "-darwin"
        else:
            suffix = "-linux-x86_64"

        local_name = "qjs" + suffix

        # 1. Bundled bin/
        bundled = os.path.normpath(
            os.path.join(os.path.dirname(__file__), "..", "bin", local_name)
        )
        if os.path.isfile(bundled):
            return os.path.realpath(bundled)

        # 2. Cache dir
        cache_dir = cls._resolve_cache_dir(config)
        cached = os.path.join(cache_dir, local_name)
        if os.path.isfile(cached):
            return os.path.realpath(cached)

        # 3. Download
        os.makedirs(cache_dir, exist_ok=True)
        version = "v0.11.0"
        url = f"https://github.com/quickjs-ng/quickjs/releases/download/{version}/{local_name}"
        try:
            cls._download_file(url, cached)
            os.chmod(cached, 0o755)
            return os.path.realpath(cached)
        except Exception:
            return "qjs"

    @classmethod
    def _download_file(cls, url: str, target: str) -> None:
        try:
            with urllib.request.urlopen(url, timeout=60) as response:
                content = response.read()
        except urllib.error.URLError as e:
            raise RuntimeError(f"MorphQL: Failed to download {url}: {e}")

        if len(content) < 1000:
            raise RuntimeError(f"MorphQL: Downloaded file too small from {url}")

        with open(target, "wb") as f:
            f.write(content)

    @classmethod
    def _resolve_cache_dir(cls, config: Dict[str, Any]) -> str:
        if config.get("cache_dir"):
            return config["cache_dir"]
        return os.path.join(tempfile.gettempdir(), "morphql")

    # ------------------------------------------------------------------
    #  Server Provider
    # ------------------------------------------------------------------

    @classmethod
    def _execute_via_server(
        cls,
        query: Optional[str],
        data: Any,
        config: Dict[str, Any],
        query_file: Optional[str] = None,
    ) -> str:
        if query_file is not None:
            with open(query_file, "r", encoding="utf-8") as f:
                query = f.read().strip()

        # Server expects decoded data, not raw JSON string
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except (json.JSONDecodeError, ValueError):
                pass

        payload = json.dumps({"query": query, "data": data}).encode("utf-8")
        url = config["server_url"].rstrip("/") + "/v1/execute"

        headers = {"Content-Type": "application/json"}
        if config.get("api_key"):
            headers["X-API-KEY"] = config["api_key"]

        req = urllib.request.Request(url, data=payload, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=int(config["timeout"])) as response:
                body = response.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"MorphQL server returned HTTP {e.code}: {body}")
        except urllib.error.URLError as e:
            raise RuntimeError(f"MorphQL server unreachable: {url} — {e.reason}")

        try:
            response_data = json.loads(body)
        except json.JSONDecodeError:
            raise RuntimeError(f"MorphQL server returned invalid JSON: {body}")

        if not response_data.get("success"):
            msg = response_data.get("message", body)
            raise RuntimeError(f"MorphQL server error: {msg}")

        return response_data["result"]

    # ------------------------------------------------------------------
    #  Config Resolution
    # ------------------------------------------------------------------

    @classmethod
    def _resolve_config(
        cls,
        options: Dict[str, Any],
        defaults: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        config: Dict[str, Any] = {}
        for key, hardcoded in cls._OPTION_DEFAULTS.items():
            if key in options:
                config[key] = options[key]
            elif defaults and key in defaults:
                config[key] = defaults[key]
            else:
                env_key = cls._ENV_MAP.get(key)
                env_val = os.environ.get(env_key, "") if env_key else ""
                if env_val:
                    config[key] = env_val
                else:
                    config[key] = hardcoded
        return config

    # ------------------------------------------------------------------
    #  Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _normalize_data(data: Any) -> str:
        if data is None:
            return "{}"
        if isinstance(data, (dict, list)):
            return json.dumps(data)
        return str(data)

    @staticmethod
    def _validate_query_file(path: str) -> None:
        if not os.path.exists(path):
            raise FileNotFoundError(f"MorphQL: query file not found: {path}")
        if not os.access(path, os.R_OK):
            raise PermissionError(f"MorphQL: query file not readable: {path}")
