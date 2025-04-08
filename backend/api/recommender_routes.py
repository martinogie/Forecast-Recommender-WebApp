from flask import Blueprint, request, jsonify
from models.recommender import RenewableEnergyRecommender

recommender_bp = Blueprint('recommender', __name__)
recommender = RenewableEnergyRecommender()

@recommender_bp.route('/train', methods=['POST'])
def train_recommender():
    """Endpoint to train or retrain the recommender system"""
    try:
        data = request.get_json()
        interactions_df = data.get('interactions')
        products_df = data.get('products')
        
        if interactions_df and products_df:
            recommender.train(interactions_df, products_df)
            return jsonify({
                "success": True,
                "message": "Recommender system trained successfully"
            }), 200
        else:
            # Train with sample data
            recommender.train()
            return jsonify({
                "success": True,
                "message": "Recommender system trained with sample data"
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error training recommender: {str(e)}"
        }), 500

@recommender_bp.route('/similar/<int:product_id>', methods=['GET'])
def get_similar_products(product_id):
    """Get products similar to the given product ID"""
    try:
        count = request.args.get('count', default=5, type=int)
        
        similar_products = recommender.get_similar_products(product_id, n=count)
        
        return jsonify({
            "success": True,
            "product_id": product_id,
            "similar_products": similar_products
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error getting similar products: {str(e)}"
        }), 500

@recommender_bp.route('/recommend/user/<int:user_id>', methods=['GET'])
def recommend_for_user(user_id):
    """Get product recommendations for a specific user"""
    try:
        count = request.args.get('count', default=5, type=int)
        
        recommendations = recommender.recommend_for_user(user_id, n=count)
        
        return jsonify({
            "success": True,
            "user_id": user_id,
            "recommendations": recommendations
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error getting recommendations: {str(e)}"
        }), 500

@recommender_bp.route('/recommend/category/<category>', methods=['GET'])
def recommend_by_category(category):
    """Get top product recommendations in a specific category"""
    try:
        count = request.args.get('count', default=5, type=int)
        
        recommendations = recommender.recommend_by_category(category, n=count)
        
        return jsonify({
            "success": True,
            "category": category,
            "recommendations": recommendations
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error getting category recommendations: {str(e)}"
        }), 500 