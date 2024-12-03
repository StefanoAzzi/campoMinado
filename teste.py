from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def hello():
    titulo = "Tela Inicial"

    return render_template('index.html', titulo=titulo)

@app.route('/game', methods=['POST'])
def game():
    titulo = "Campo Minado"
    nick = request.form['nick']
    minas = request.form['minas']
    x = request.form['tamanhoX']
    y = request.form['tamanhoY']

    return render_template('game.html', titulo=titulo, nick=nick, minas=minas, x=x, y=y)

if __name__ == '__main__':
    app.run(debug=True)