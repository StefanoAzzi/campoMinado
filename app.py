from flask import Flask, render_template, jsonify
import random


app = Flask(__name__)


BOARD_SIZE = 8  
NUM_MINES = 10  


def generate_board(size, num_mines):


    board = [[0 for _ in range(size)] for _ in range(size)]
   
    # Coloca minas aleatoriamente
    mines = set()
    while len(mines) < num_mines:
        x, y = random.randint(0, size - 1), random.randint(0, size - 1)
        mines.add((x, y))
   
    for x, y in mines:
        board[x][y] = -1  


        # Atualiza os números ao redor das minas
        for i in range(-1, 2):
            for j in range(-1, 2):
                nx, ny = x + i, y + j
                if 0 <= nx < size and 0 <= ny < size and board[nx][ny] != -1:
                    board[nx][ny] += 1
   
    return board


@app.route('/')
def index():
    board = generate_board(BOARD_SIZE, NUM_MINES)
    return render_template('index.html', board=board)


@app.route('/api/board')
def get_board():
    board = generate_board(BOARD_SIZE, NUM_MINES)
    return jsonify({'board': board})


if __name__ == '__main__':
    app.run(debug=True)


