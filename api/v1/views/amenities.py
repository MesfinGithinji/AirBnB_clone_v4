#!/usr/bin/python3
"""Amenity View """

from flask import jsonify, request
from werkzeug.exceptions import NotFound, MethodNotAllowed, BadRequest

from api.v1.views import app_views
from models import storage
from models.amenity import Amenity

ALLOWED_METHODS = ['GET', 'DELETE', 'POST', 'PUT']
"""Methods allowed for amenities endpoint."""


@app_views.route('/amenities', methods=ALLOWED_METHODS)
@app_views.route('/amenities/<amenity_id>', methods=ALLOWED_METHODS)
def handle_amenities(amenity_id=None):
    '''The method handler for the amenities endpoint.
    '''
    handlers = {
        'GET': get_amenities,
        'DELETE': delete_amenity,
        'POST': create_amenity,
        'PUT': update_amenity,
    }
    if request.method in handlers:
        return handlers[request.method](amenity_id)
    else:
        raise MethodNotAllowed(list(handlers.keys()))


@app_views.route('/amenities', methods=['GET'], strict_slashes=False)
def get_amenities():
    """Retrieve amenity objects"""
    all_amenities = storage.all(Amenity).values()
    if amenity_id:
        res = list(filter(lambda x: x.id == amenity_id, all_amenities))
        if res:
            return jsonify(res[0].to_dict())
        raise NotFound()
    all_amenities = list(map(lambda x: x.to_dict(), all_amenities))
    return jsonify(all_amenities)


@app_views.route('/amenities/<amenity_id>', methods=['GET'],
                 strict_slashes=False)
def get_amenity(amenity_id):
    """Retrieves object by ID"""
    amenity = storage.get("Amenity", amenity_id)
    if amenity is None:
        abort(404)
    return jsonify(amenity.to_dict())


@app_views.route('/amenities/<amenity_id>', methods=['DELETE'],
                 strict_slashes=False)
def delete_amenity(amenity_id):
    """Delete object by ID"""
    all_amenities = storage.all(Amenity).values()
    res = list(filter(lambda x: x.id == amenity_id, all_amenities))
    if res:
        storage.delete(res[0])
        storage.save()
        return jsonify({}), 200
    raise NotFound()


@app_views.route('/amenities', methods=['POST'], strict_slashes=False)
def create_amenity():
    """Create an Amenity object"""
    data = request.get_json()
    if type(data) is not dict:
        raise BadRequest(description='Not a JSON')
    if 'name' not in data:
        raise BadRequest(description='Missing name')
    new_amenity = Amenity(**data)
    new_amenity.save()
    return jsonify(new_amenity.to_dict()), 201


@app_views.route('/amenities/<amenity_id>', methods=['PUT'],
                 strict_slashes=False)
def update_amenity(amenity_id):
    """Update the Amenity object by ID"""
    place_keys = ('id', 'created_at', 'updated_at')
    all_amenities = storage.all(Amenity).values()
    res = list(filter(lambda x: x.id == amenity_id, all_amenities))
    if res:
        data = request.get_json()
        if type(data) is not dict:
            raise BadRequest(description='Not a JSON')
        old_amenity = res[0]
        for key, value in data.items():
            if key not in place_keys:
                setattr(old_amenity, key, value)
        old_amenity.save()
        return jsonify(old_amenity.to_dict()), 200
    raise NotFound()
