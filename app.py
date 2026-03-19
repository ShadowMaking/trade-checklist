"""
下单前 Checklist 助手 — 零依赖版本
使用 Python 标准库运行，无需 pip install。

用法:
    python3 app.py              # 默认 0.0.0.0:5099
    python3 app.py --port 8080  # 自定义端口

手机访问: 确保手机和电脑在同一局域网，
用手机浏览器打开 http://<电脑IP>:5099
"""

import argparse
import html
import json
import os
import socket
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "checklist.json")
TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "index.html")


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def render_template(config):
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template = f.read()

    settings = config["settings"]

    categories_html = ""
    for cat in config["categories"]:
        items_html = ""
        for item in cat["items"]:
            required_str = "true" if item["required"] else "false"
            badge = '<span class="required-badge">必选</span>' if item["required"] else ""
            hint_html = ""
            if item.get("hint"):
                hint_html = f'<div class="item-hint">💡 {html.escape(item["hint"])}</div>'

            items_html += f"""
      <div class="checklist-item" data-required="{required_str}" onclick="toggleItem(this)">
        <div class="checkbox">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M2 7.5L5.5 11L12 3" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="item-content">
          <span class="item-text">{html.escape(item["text"])}{badge}</span>
          {hint_html}
        </div>
      </div>"""

        categories_html += f"""
    <div class="category">
      <div class="category-header">
        <span class="category-icon">{cat["icon"]}</span>
        <span>{html.escape(cat["name"])}</span>
      </div>
      {items_html}
    </div>"""

    replacements = {
        "{{ settings.title }}": html.escape(settings["title"]),
        "{{ settings.subtitle }}": html.escape(settings["subtitle"]),
        "{{ settings.confirm_button_text }}": settings["confirm_button_text"],
        "{{ settings.reset_button_text }}": settings["reset_button_text"],
        "{{ settings.cooldown_seconds }}": str(settings["cooldown_seconds"]),
        "<!-- CATEGORIES_PLACEHOLDER -->": categories_html,
    }

    for key, value in replacements.items():
        template = template.replace(key, value)

    return template


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


class ChecklistHandler(SimpleHTTPRequestHandler):
    rendered_html = ""

    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            content = self.rendered_html.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        elif self.path == "/api/checklist":
            config = load_config()
            body = json.dumps(config, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description="下单前 Checklist 助手")
    parser.add_argument("--port", type=int, default=5099, help="监听端口 (默认 5099)")
    parser.add_argument("--host", default="0.0.0.0", help="监听地址 (默认 0.0.0.0)")
    args = parser.parse_args()

    config = load_config()
    ChecklistHandler.rendered_html = render_template(config)

    local_ip = get_local_ip()
    server = HTTPServer((args.host, args.port), ChecklistHandler)

    print(f"\n  📋 下单 Checklist 助手已启动\n")
    print(f"  本机访问:  http://localhost:{args.port}")
    print(f"  手机访问:  http://{local_ip}:{args.port}")
    print(f"\n  确保手机和电脑在同一 WiFi 网络下")
    print(f"  按 Ctrl+C 停止\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  已停止")
        server.server_close()


if __name__ == "__main__":
    main()
