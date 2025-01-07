from bson import ObjectId
from flask_pymongo import PyMongo
from utils.db import mongo

class Board:
    @staticmethod
    def create_initial_board(user_id):
        initial_board = {
            "user_id": user_id,
            "name": "My First Board",
            "lists": [
                {"id": "list1", "title": "To Do", "cards": []},
                {"id": "list2", "title": "In Progress", "cards": []},
                {"id": "list3", "title": "Done", "cards": []}
            ],
            "starred": False
        }
        mongo.db.boards.insert_one(initial_board)

    @staticmethod
    def find_board_by_user_id(user_id):
        return mongo.db.boards.find_one({"user_id": ObjectId(user_id)})
    
    @staticmethod
    def create_board(user_id, name):
        new_board = {
            "user_id": ObjectId(user_id),
            "name": name,
            "lists": [
                {"id": "list1", "title": "To Do", "cards": []},
                {"id": "list2", "title": "In Progress", "cards": []},
                {"id": "list3", "title": "Done", "cards": []}
            ],
            "starred": False
        }
        result = mongo.db.boards.insert_one(new_board)
        return result.inserted_id

    @staticmethod
    def update_board(board_id, user_id, lists):
        result = mongo.db.boards.update_one(
            {"_id": ObjectId(board_id), "user_id": ObjectId(user_id)},
            {"$set": {"lists": lists}}
        )
        return result
    
    @staticmethod
    def update_star_status(board_id, user_id, starred):
        result = mongo.db.boards.update_one(
            {"_id": ObjectId(board_id), "user_id": ObjectId(user_id)},
            {"$set": {"starred": starred}}
        )
        return result.modified_count > 0

    @staticmethod
    def find_starred_boards(user_id):
        return list(mongo.db.boards.find(
            {"user_id": ObjectId(user_id), "starred": True},
            {"_id": 1, "name": 1}
        ))

    @staticmethod
    def search_boards(user_id, query):
        return list(mongo.db.boards.find(
            {"user_id": ObjectId(user_id), "name": {"$regex": query, "$options": "i"}},
            {"_id": 1, "name": 1}
        ))

    @staticmethod
    def update_card(user_id, card_id, description, difficulty):
        board = mongo.db.boards.find_one({"user_id": ObjectId(user_id)})
        updated = False
        for list_ in board["lists"]:
            for card in list_["cards"]:
                if card["id"] == card_id:
                    if description is not None:
                        card["description"] = description
                    if difficulty is not None:
                        if difficulty not in ["easy", "medium", "hard"]:
                            return {"message": "Invalid difficulty"}, 400
                        card["difficulty"] = difficulty
                    updated = True
                    break
            if updated:
                break
        if not updated:
            return {"message": "Card not found"}, 404
        mongo.db.boards.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": {"lists": board["lists"]}}
        )
        return {"message": "Card updated successfully"}, 200
