from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates', static_folder='static')


@app.route('/menu', methods=['GET'])
def show_menu():

    return render_template('NoodleBoysMenu.html')


@app.route('/menu', methods=['POST'])
def process_order():
    data = request.get_json()
    if not data or 'items' not in data or 'total' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    # For now, just return the data to confirm receipt
    return jsonify({
        'status': 'success',
        'items': data['items'],
        'total': data['total']
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)