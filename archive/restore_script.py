import json

with open('backups/articles/ベトナム人材紹介会社_v1_2024-02-26.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

restore = {
    'title': data['title']['raw'],
    'content': data['content']['raw'],
    'excerpt': data['excerpt']['raw']
}

with open('restore_ベトナム人材紹介会社.json', 'w', encoding='utf-8') as f:
    json.dump(restore, f, ensure_ascii=False)

print('Restore file created successfully')
