from flask import jsonify, request
from models.board_model import Board
from flask_jwt_extended import jwt_required, get_jwt_identity

@jwt_required()
def get_board():
    verify_jwt_in_request()
    user_id = get_jwt_identity()
    board = Board.find_board_by_user_id(user_id)

    if not board:
        return jsonify({"message": "Board not found"}), 404

    return jsonify({
        "id": str(board["_id"]),
        "name": board["name"],
        "lists": board["lists"]
    }), 200

def create_board():
    verify_jwt_in_request()
    user_id = get_jwt_identity()
    name = request.json.get("name")

    if not name:
        return jsonify({"message": "Missing board name"}), 400

    board_id = Board.create_board(user_id, name)
    return jsonify({"message": "Board created successfully", "board_id": board_id}), 201

@jwt_required()
def update_board():
    verify_jwt_in_request()
    user_id = get_jwt_identity()
    board_id = request.json.get("boardId")
    lists = request.json.get("lists")

    if not board_id or not lists:
        return jsonify({"message": "Missing Board ID or lists data"}), 400

    result = Board.update_board(board_id, user_id, lists)

    if result.modified_count == 0:
        return jsonify({"message": "Board not found or not modified"}), 404

    return jsonify({"message": "Board updated successfully"}), 200

@jwt_required()
def create_board():
    user_id = get_jwt_identity()
    name = request.json.get("name")
    
    if not name:
        return jsonify({"message": "Missing board name"}), 400
    
    board_id = Board.create_board(user_id, name)
    
    return jsonify({
        "message": "Board created successfully",
        "boardId": str(board_id)
    }), 201

@jwt_required()
def star_board():
    user_id = get_jwt_identity()
    board_id = request.json.get("boardId")
    starred = request.json.get("starred")
    
    if board_id is None or starred is None:
        return jsonify({"message": "Missing board ID or starred status"}), 400
    
    result = Board.update_star_status(board_id, user_id, starred)
    
    if not result:
        return jsonify({"message": "Board not found or not modified"}), 404
    
    return jsonify({"message": "Board starred status updated successfully"}), 200

@jwt_required()
def get_starred_boards():
    user_id = get_jwt_identity()
    starred_boards = Board.find_starred_boards(user_id)
    
    return jsonify([
        {"id": str(board["_id"]), "name": board["name"]}
        for board in starred_boards
    ]), 200

@jwt_required()
def search_boards():
    user_id = get_jwt_identity()
    query = request.args.get("q", "")
    
    if not query:
        return jsonify({"message": "Missing search query"}), 400
    
    boards = Board.search_boards(user_id, query)
    
    return jsonify([
        {"id": str(board["_id"]), "name": board["name"]}
        for board in boards
    ]), 200

@jwt_required()
def star_board():
    verify_jwt_in_request()
    user_id = get_jwt_identity()
    board_id = request.json.get("board_id")

    if not board_id:
        return jsonify({"message": "Missing board ID"}), 400

    result = Board.star_board(board_id, user_id)

    if result.modified_count == 0:
        return jsonify({"message": "Board not found or already starred"}), 404

    return jsonify({"message": "Board starred successfully"}), 200

def unstar_board():
    verify_jwt_in_request()
    user_id = get_jwt_identity()
    board_id = request.json.get("board_id")

    if not board_id:
        return jsonify({"message": "Missing board ID"}), 400

    result = Board.unstar_board(board_id, user_id)

    if result.modified_count == 0:
        return jsonify({"message": "Board not found or already unstarred"}), 404

    return jsonify({"message": "Board unstarred successfully"}), 200

def get_starred_boards():
    verify_jwt_in_request()
    user_id = get_jwt_identity()
    boards = Board.get_starred_boards(user_id)

    return jsonify({"starred_boards": boards}), 200

def update_card():
    verify_jwt_in_request()
    user_id = get_jwt_identity()
    card_id = request.json.get("card_id")
    description = request.json.get("description")
    difficulty = request.json.get("difficulty")

    if not card_id:
        return jsonify({"message": "Missing card ID"}), 400

    result, status_code = Board.update_card(user_id, card_id, description, difficulty)
    return jsonify(result), status_code

@jwt_required()
def get_progress_report():
    user_id = get_jwt_identity()

    # Fetch the user's board
    board = Board.find_board_by_user_id(user_id)
    if not board:
        return jsonify({"message": "Board not found"}), 404

    # Initialize progress report
    total_cards = 0
    report = {}
    done_cards = 0

    for list_item in board.get("lists", []):
        list_id = list_item.get("id")
        list_title = list_item.get("title")
        cards = list_item.get("cards", [])

        # Add count for this list
        report[list_title] = len(cards)
        total_cards += len(cards)

        # Check if this list is "Done"
        if "done" in list_title.lower():
            done_cards += len(cards)

    # Calculate progress percentage
    progress_percentage = (done_cards / total_cards * 100) if total_cards > 0 else 0

    return jsonify({
        "total_cards": total_cards,
        "done_cards": done_cards,
        "progress_percentage": progress_percentage,
        "list_report": report
    }), 200
