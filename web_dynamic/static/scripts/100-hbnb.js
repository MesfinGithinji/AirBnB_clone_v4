/**
 * Class for checking the status of the API.
 */
class ApiStatusChecker {
  /**
     * Initialize the API status checker.
     * @param {string} apiUrl - The URL of the API status endpoint.
     * @param {string} statusElementId - The ID of the HTML element to display the API status.
     */
  constructor(apiUrl, statusElementId) {
    this.apiUrl = apiUrl;
    this.statusElementId = statusElementId;
  }

  /**
     * Check the status of the API and update the HTML element accordingly.
     */
  checkStatus() {
    $.get(this.apiUrl, (data) => {
      if (data.status === 'OK') {
        this.setStatusAvailable();
      } else {
        this.setStatusUnavailable();
      }
    }).fail(() => {
      console.error('Error checking API status');
      this.setStatusUnavailable();
    });
  }

  /**
     * Set the API status as available by adding a CSS class.
     */
  setStatusAvailable() {
    $(`#${this.statusElementId}`).addClass('available');
  }

  /**
     * Set the API status as unavailable by removing a CSS class.
     */
  setStatusUnavailable() {
    $(`#${this.statusElementId}`).removeClass('available');
  }
}

/**
   * Class for managing the amenity filter.
   */
class AmenityFilter {
  /**
     * Initialize the amenity filter.
     */
  constructor() {
    this.selectedAmenities = {};
    // Listen for changes on each input checkbox tag
    $('input[type=checkbox]').change(
      function () {
        const amenityId = $(this).data('id');
        if ($(this).is(':checked')) {
          this.selectedAmenities[amenityId] = true;
        } else {
          delete this.selectedAmenities[amenityId];
        }
      }.bind(this)
    ); // Use .bind(this) to retain the correct 'this' context
  }

  /**
     * Get the selected amenities.
     * @returns {string[]} - An array of selected amenity IDs.
     */
  getSelectedAmenities() {
    return Object.keys(this.selectedAmenities);
  }
}

/**
   * Class for managing the location filter.
   */
class LocationFilter {
  /**
     * Initialize the location filter.
     */
  constructor() {
    this.selectedLocations = {};
    // Listen for changes on each input checkbox tag
    $('input[type=checkbox]').change(
      function () {
        const locationId = $(this).data('id');
        if ($(this).is(':checked')) {
          this.selectedLocations[locationId] = true;
        } else {
          delete this.selectedLocations[locationId];
        }
      }.bind(this)
    ); // Use .bind(this) to retain the correct 'this' context
  }

  /**
     * Get the selected locations.
     * @returns {string[]} - An array of selected location IDs.
     */
  getSelectedLocations() {
    return Object.keys(this.selectedLocations);
  }
}

/**
   * Class for loading and displaying places based on filters.
   */
class PlaceLoader {
  /**
     * Initialize the place loader.
     */
  constructor() {
    this.filterButton = $('#filter_button');
    this.placesSection = $('.places');
    this.amenityFilter = new AmenityFilter();
    this.locationFilter = new LocationFilter();

    this.filterButton.click(() => {
      this.loadPlaces();
    });
  }

  /**
     * Load places based on selected filters.
     */
  loadPlaces() {
    const amenities = this.amenityFilter.getSelectedAmenities();
    const locations = this.locationFilter.getSelectedLocations();
    const data = { amenities, locations };

    $.ajax({
      type: 'POST',
      url: '/100-hbnb/filter_places',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: (places) => {
        this.displayPlaces(places);
      },
      error: () => {
        console.error('Error loading places');
      }
    });
  }

  /**
     * Display places in the HTML section.
     * @param {object[]} places - An array of place objects.
     */
  displayPlaces(places) {
    this.placesSection.empty();
    for (const place of places) {
      const article = this.createPlaceArticle(place);
      this.placesSection.append(article);
    }
  }

  /**
     * Create an HTML article element for a place.
     * @param {object} place - A place object with information.
     * @returns {jQuery} - A jQuery object representing the created article element.
     */
  createPlaceArticle(place) {
    // Create a new article element
    const article = $('<article>');

    // Create the title box section
    const titleBox = $('<div class="title_box"></div>');
    const title = $(`<h2>${place.name}</h2>`);
    const priceByNight = $(
      `<div class="price_by_night">$${place.price_by_night}</div>`
    );
    titleBox.append(title, priceByNight);

    // Create the information section
    const information = $('<div class="information"></div>');
    const maxGuest = $(
      `<div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''
      }</div>`
    );
    const numberRooms = $(
      `<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''
      }</div>`
    );
    const numberBathrooms = $(
      `<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''
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

    // Return the created article element
    return article;
  }
}
/**
   * Document ready function to initialize the API status checker and place loader.
   */
$(document).ready(function () {
  // Define API URL as a constant
  const apiUrl = 'http://0.0.0.0:5001/api/v1/status/';
  const statusElementId = 'api_status';
  const apiStatusChecker = new ApiStatusChecker(apiUrl, statusElementId);
  apiStatusChecker.checkStatus();

  const placeLoader = new PlaceLoader();
});
