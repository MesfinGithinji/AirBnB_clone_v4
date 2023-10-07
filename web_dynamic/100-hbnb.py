#!/usr/bin/python3
"""
Start the Flask Web App for HBNB project.
"""

# Import necessary modules and classes
from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place
from flask import Flask, render_template, request, jsonify
from uuid import uuid4


app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """
    Closes the SQLAlchemy Session when the request context ends.
    Args:
        error: The error (if any) that occurred during the request.
    """
    storage.close()


@app.route('/100-hbnb/', strict_slashes=False)
def hbnb():
    """
    Display the HBNB web page.

    Returns:
        str: Rendered HTML template for the HBNB web page.
    """
    # Get all states, sorted by name
    states = storage.all(State).values()
    states_list = sorted(states, key=lambda s: s.name)

    # Create a list of states with their cities, sorted by city name
    states_and_cities = [
        (state, sorted(state.cities, key=lambda c: c.name))
        for state in states_list
    ]

    # Get all amenities, sorted by name
    amenities = storage.all(Amenity).values()
    amenities_list = sorted(amenities, key=lambda a: a.name)

    # Get all places, sorted by name
    places = storage.all(Place).values()
    places_list = sorted(places, key=lambda p: p.name)

    # Generate a cache ID using uuid4
    cache_id = str(uuid4())

    return render_template('100-hbnb.html',
                           states=states_and_cities,
                           amenities=amenities_list,
                           places=places_list,
                           cache_id=cache_id)


@app.route('/100-hbnb/filter_places', methods=['POST'])
def filter_places():
    """
    Filter places by selected amenities.

    Returns:
        Response: A JSON response containing a list of places without 'amenities'.
    """
    # Get the list of amenities from the request JSON data
    data = request.get_json()
    amenities = data.get('amenities', [])

    # Get all places from the storage
    places = storage.all(Place).values()

    # Use list comprehension to filter places based on selected amenities
    filtered_places = [
        place for place in places if all(amenity.id in [a.id for a in place.amenities] for amenity in amenities)
    ]

    # Create the final list of places without 'amenities' in the response
    places_data = [place.to_dict() for place in filtered_places]
    for place in places_data:
        place.pop('amenities', None)

    return jsonify(places_data)


if __name__ == "__main__":
    # Run the Flask app on host '0.0.0.0' and port 5000
    app.run(host='0.0.0.0', port=5000)
