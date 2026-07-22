#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

class Checker(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        node_id = values.get('id')
        if node_id:
            if node_id in self.ids:
                errors.append(f'{self.path}: duplicate id #{node_id}')
            self.ids.add(node_id)

        if values.get('target') == '_blank':
            rel = set((values.get('rel') or '').split())
            if not {'noopener', 'noreferrer'} <= rel:
                errors.append(f'{self.path}: target=_blank missing safe rel on {values.get("href", tag)}')

        for attr in ('href', 'src'):
            value = values.get(attr)
            if not value or value.startswith(('#', 'mailto:', 'tel:', 'data:', 'javascript:')):
                continue
            parsed = urlparse(value)
            if parsed.scheme or value.startswith('//'):
                continue
            local = (ROOT / parsed.path.lstrip('/')).resolve() if parsed.path.startswith('/') else (self.path.parent / parsed.path).resolve()
            try:
                local.relative_to(ROOT)
            except ValueError:
                errors.append(f'{self.path}: reference escapes site root: {value}')
                continue
            if not local.exists():
                errors.append(f'{self.path}: missing local reference: {value}')

for path in sorted(ROOT.rglob('*.html')):
    parser = Checker(path)
    try:
        parser.feed(path.read_text(encoding='utf-8'))
        parser.close()
    except Exception as exc:
        errors.append(f'{path}: HTML parse error: {exc}')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print('HTML validation passed: local references, duplicate IDs, and safe external links are valid.')
