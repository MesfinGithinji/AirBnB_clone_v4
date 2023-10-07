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

// Initialize AmenityManager when the document is ready
$(document).ready(function () {
  const amenityManager = new AmenityManager();
});
