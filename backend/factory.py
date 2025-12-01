from __future__ import annotations
from flask import Flask, jsonify
from flask_cors import CORS
from routes.admin import admin_bp
from routes.auth import auth_bp   

class DefaultConfig:
    JSON_SORT_KEYS = False
    PROPAGATE_EXCEPTIONS = False

def register_blueprints(app: Flask) -> None:
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(auth_bp, url_prefix="/api") 

def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(404)
    def not_found(_): return jsonify({"error": "not_found"}), 404
    @app.errorhandler(500)
    def internal_error(_): return jsonify({"error": "internal_server_error"}), 500

def create_app(config_object=None) -> Flask:
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(config_object or DefaultConfig)
    register_blueprints(app)
    register_error_handlers(app)
    return app

__all__ = ["create_app", "DefaultConfig"]