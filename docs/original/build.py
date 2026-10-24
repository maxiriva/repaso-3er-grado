import json
bank=json.load(open('banco.json'))
js=json.dumps(bank,ensure_ascii=False).replace('</','<\\/')
tpl=open('app.template.html').read().replace('/*BANK*/',js)
open('repaso-3er-grado.html','w').write(tpl)
head='<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
i=tpl.index('<div class="wrap"')
open('index.html','w').write(head+tpl[:i]+'</head>\n<body>\n'+tpl[i:]+'\n</body>\n</html>\n')
print('ok')
