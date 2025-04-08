import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
import joblib
import os

class RenewableEnergyRecommender:
    def __init__(self):
        self.user_item_matrix = None
        self.products = None
        self.user_mapping = {}
        self.product_mapping = {}
        self.similarity_matrix = None
        self.model_path = os.path.join(os.path.dirname(__file__), 'saved_models', 'recommender_model.pkl')
        
    def _create_sample_data(self):
        """Create sample data for initial training if no data exists"""
        # Sample renewable energy products
        products = [
            {"id": 1, "name": "Solar Panel 300W", "category": "solar", "efficiency": 0.22, "price": 250},
            {"id": 2, "name": "Wind Turbine 1kW", "category": "wind", "efficiency": 0.35, "price": 1200},
            {"id": 3, "name": "Home Battery 10kWh", "category": "storage", "efficiency": 0.9, "price": 3500},
            {"id": 4, "name": "Solar Inverter 3kW", "category": "solar", "efficiency": 0.97, "price": 800},
            {"id": 5, "name": "Smart Energy Monitor", "category": "efficiency", "efficiency": 0.99, "price": 150},
            {"id": 6, "name": "Solar Water Heater", "category": "solar", "efficiency": 0.75, "price": 1800},
            {"id": 7, "name": "Energy Efficient LED Bulbs (10pk)", "category": "efficiency", "efficiency": 0.95, "price": 30},
            {"id": 8, "name": "Micro Hydro Generator", "category": "hydro", "efficiency": 0.7, "price": 2200},
            {"id": 9, "name": "Biomass Stove", "category": "biomass", "efficiency": 0.6, "price": 450},
            {"id": 10, "name": "Solar Charge Controller", "category": "solar", "efficiency": 0.98, "price": 120}
        ]
        
        # Sample user interactions with ratings (1-5)
        interactions = [
            {"user_id": 1, "product_id": 1, "rating": 5},
            {"user_id": 1, "product_id": 3, "rating": 4},
            {"user_id": 1, "product_id": 5, "rating": 5},
            {"user_id": 2, "product_id": 2, "rating": 5},
            {"user_id": 2, "product_id": 4, "rating": 3},
            {"user_id": 2, "product_id": 8, "rating": 4},
            {"user_id": 3, "product_id": 1, "rating": 4},
            {"user_id": 3, "product_id": 2, "rating": 3},
            {"user_id": 3, "product_id": 10, "rating": 5},
            {"user_id": 4, "product_id": 3, "rating": 5},
            {"user_id": 4, "product_id": 6, "rating": 4},
            {"user_id": 4, "product_id": 9, "rating": 2},
            {"user_id": 5, "product_id": 5, "rating": 5},
            {"user_id": 5, "product_id": 7, "rating": 4},
            {"user_id": 5, "product_id": 10, "rating": 4}
        ]
        
        return pd.DataFrame(products), pd.DataFrame(interactions)
        
    def train(self, interactions_df=None, products_df=None):
        """Train the recommender system with user-item interactions"""
        if interactions_df is None or products_df is None:
            products_df, interactions_df = self._create_sample_data()
        
        self.products = products_df
        
        # Create user-item matrix
        for i, user_id in enumerate(np.unique(interactions_df['user_id'])):
            self.user_mapping[user_id] = i
            
        for i, product_id in enumerate(np.unique(interactions_df['product_id'])):
            self.product_mapping[product_id] = i
            
        # Create sparse matrix
        rows = [self.user_mapping[user] for user in interactions_df['user_id']]
        cols = [self.product_mapping[product] for product in interactions_df['product_id']]
        ratings = interactions_df['rating'].values
        
        self.user_item_matrix = csr_matrix((ratings, (rows, cols)), 
                                          shape=(len(self.user_mapping), len(self.product_mapping)))
        
        # Calculate similarity between items
        item_similarity = cosine_similarity(self.user_item_matrix.T)
        self.similarity_matrix = pd.DataFrame(item_similarity, 
                                             index=list(self.product_mapping.keys()),
                                             columns=list(self.product_mapping.keys()))
        
        # Save model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        model_data = {
            'user_item_matrix': self.user_item_matrix,
            'products': self.products,
            'user_mapping': self.user_mapping,
            'product_mapping': self.product_mapping,
            'similarity_matrix': self.similarity_matrix
        }
        joblib.dump(model_data, self.model_path)
        
    def load_model(self):
        """Load a trained model if it exists"""
        if os.path.exists(self.model_path):
            model_data = joblib.load(self.model_path)
            self.user_item_matrix = model_data['user_item_matrix']
            self.products = model_data['products']
            self.user_mapping = model_data['user_mapping']
            self.product_mapping = model_data['product_mapping']
            self.similarity_matrix = model_data['similarity_matrix']
            return True
        return False
        
    def get_similar_products(self, product_id, n=5):
        """Get top n similar products to a given product"""
        if self.similarity_matrix is None:
            if not self.load_model():
                self.train()
                
        if product_id not in self.similarity_matrix.index:
            return []
            
        similar_scores = self.similarity_matrix.loc[product_id].sort_values(ascending=False)
        similar_products = similar_scores.index.tolist()[1:n+1]  # exclude the product itself
        
        result = []
        for pid in similar_products:
            product = self.products[self.products['id'] == pid].iloc[0].to_dict()
            product['similarity_score'] = float(similar_scores[pid])
            result.append(product)
            
        return result
        
    def recommend_for_user(self, user_id, n=5):
        """Recommend top n products for a user"""
        if self.user_item_matrix is None:
            if not self.load_model():
                self.train()
                
        # For new users, return top rated products
        if user_id not in self.user_mapping:
            # Return top products based on average rating
            top_products = self.products.head(n).to_dict('records')
            return top_products
            
        user_idx = self.user_mapping[user_id]
        user_ratings = self.user_item_matrix[user_idx].toarray().flatten()
        
        # Get products the user hasn't rated yet
        unrated_products = [pid for pid, idx in self.product_mapping.items() 
                           if user_ratings[idx] == 0]
        
        # Calculate predicted ratings for unrated products
        predicted_ratings = {}
        for pid in unrated_products:
            similar_scores = self.similarity_matrix.loc[pid]
            weighted_sum = 0
            total_weight = 0
            
            for other_pid, idx in self.product_mapping.items():
                if user_ratings[idx] > 0:  # User has rated this product
                    weight = similar_scores[other_pid]
                    weighted_sum += weight * user_ratings[idx]
                    total_weight += abs(weight)
                    
            if total_weight > 0:
                predicted_rating = weighted_sum / total_weight
                predicted_ratings[pid] = predicted_rating
        
        # Get top n products with highest predicted ratings
        top_products = sorted(predicted_ratings.items(), key=lambda x: x[1], reverse=True)[:n]
        
        result = []
        for pid, rating in top_products:
            product = self.products[self.products['id'] == pid].iloc[0].to_dict()
            product['predicted_rating'] = float(rating)
            result.append(product)
            
        return result
    
    def recommend_by_category(self, category, n=5):
        """Recommend top n products in a specific category"""
        if self.products is None:
            if not self.load_model():
                self.train()
                
        category_products = self.products[self.products['category'] == category]
        
        if len(category_products) == 0:
            return []
            
        # For simplicity, sort by efficiency and return top n
        top_products = category_products.sort_values('efficiency', ascending=False).head(n)
        return top_products.to_dict('records') 