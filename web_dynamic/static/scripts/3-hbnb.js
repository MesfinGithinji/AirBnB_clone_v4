/**
 * Class to manage amenities checkboxes and update the amenities list.
 */
class AmenityManager {
  constructor () {
    // Initialize an object to store selected amenities
    this.selectedAmenities = {};

    // Bind the event listener to the instance
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    // Listen for changes on each input checkbox tag
    $('input[type=checkbox]').change(this.handleCheckboxChange);
  }

  /**
	 * Handles the change event of the checkboxes.
	 */
  handleCheckboxChange () {
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      // Checkbox is checked, add the amenity to the object
      this.addAmenity(amenityName);
    } else {
      // Checkbox is unchecked, remove the amenity from the object
      this.removeAmenity(amenityName);
    }

    // Update the amenities list displayed on the page
    this.updateAmenitiesList();
  }

  /**
	 * Adds an amenity to the selected amenities object.
	 * @param {string} amenityName - The name of the amenity.
	 */
  addAmenity (amenityName) {
    this.selectedAmenities[amenityName] = true;
  }

  /**
	 * Removes an amenity from the selected amenities object.
	 * @param {string} amenityName - The name of the amenity.
	 */
  removeAmenity (amenityName) {
    delete this.selectedAmenities[amenityName];
  }

  /**
	 * Updates the amenities list displayed on the page.
	 */
  updateAmenitiesList () {
    const amenitiesList = Object.keys(this.selectedAmenities).join(', ');
    $('div.amenities h4').text(amenitiesList);
  }
}

/**
 * Class to manage loading places from the frontend.
 */
class PlaceLoader {
  constructor () {
    // Bind the event listener to the instance
    this.loadPlaces = this.loadPlaces.bind(this);

    // Load places when the document is ready
    $(document).ready(this.loadPlaces);
  }

  /**
	 * Loads places from the frontend using an API request.
	 */
  loadPlaces () {
    // Send a POST request to the places_search endpoint
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: this.displayPlaces,
      error: this.handleLoadError
    });
  }

  /**
	 * Displays places in the frontend.
	 * @param {Array} places - Array of place objects.
	 */
  displayPlaces (places) {
    const placesSection = $('section.places');

    // Clear any existing place articles
    placesSection.empty();

    // Loop through the places and create article tags for each
    places.forEach((place) => {
      const article = $('<article></article>');

      // Create the title box
      const titleBox = $('<div class="title_box"></div>');
      const title = $(`<h2>${place.name}</h2>`);
      const priceByNight = $(
				`<div class="price_by_night">$${place.price_by_night}</div>`
      );
      titleBox.append(title, priceByNight);

      // Create the information section
      const information = $('<div class="information"></div>');
      const maxGuest = $(
				`<div class="max_guest">${place.max_guest} Guest${
					place.max_guest !== 1 ? 's' : ''
				}</div>`
      );
      const numberRooms = $(
				`<div class="number_rooms">${place.number_rooms} Bedroom${
					place.number_rooms !== 1 ? 's' : ''
				}</div>`
      );
      const numberBathrooms = $(
				`<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
					place.number_bathrooms !== 1 ? 's' : ''
				}</div>`
      );
      information.append(maxGuest, numberRooms, numberBathrooms);

      // Create the user section
      const user = $(
				`<div class="user"><b>Owner:</b> ${place.user.first_name} ${place.user.last_name}</div>`
      );

      // Create the description section
      const description = $(
				`<div class="description">${place.description}</div>`
      );

      // Append all sections to the article
      article.append(titleBox, information, user, description);

      // Append the article to the places section
      placesSection.append(article);
    });
  }

  /**
	 * Handles errors when loading places.
	 * @param {Object} xhr - The XMLHttpRequest object.
	 * @param {string} status - The status of the request.
	 * @param {string} error - The error message.
	 */
  handleLoadError (xhr, status, error) {
    console.error(`Error loading places: ${error}`);
  }
}

// Initialize AmenityManager and PlaceLoader when the document is ready
$(document).ready(function () {
  const amenityManager = new AmenityManager();
  const placeLoader = new PlaceLoader();
});
