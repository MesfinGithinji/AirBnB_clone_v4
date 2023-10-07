/**
 * Class for checking the status of an API and updating an HTML element.
 */
class ApiStatusChecker {
  /**
	 * Create a new ApiStatusChecker instance.
	 * @param {string} apiUrl - The URL of the API to check.
	 * @param {string} statusElementId - The ID of the HTML element to update based on the API status.
	 */
  constructor (apiUrl, statusElementId) {
    this.apiUrl = apiUrl;
    this.statusElementId = statusElementId;
  }

  /**
	 * Check the status of the API and update the HTML element accordingly.
	 */
  checkStatus () {
    // Make an AJAX GET request to the API URL
    $.get(this.apiUrl, (data) => {
      if (data.status === 'OK') {
        // If the API status is 'OK', set the element as available
        this.setStatusAvailable();
      } else {
        // If the API status is not 'OK', set the element as unavailable
        this.setStatusUnavailable();
      }
    }).fail(() => {
      // Handle any errors during the AJAX request
      console.error('Error checking API status');
      this.setStatusUnavailable();
    });
  }

  /**
	 * Set the HTML element as available (adds the 'available' class).
	 */
  setStatusAvailable () {
    $(`#${this.statusElementId}`).addClass('available');
  }

  /**
	 * Set the HTML element as unavailable (removes the 'available' class).
	 */
  setStatusUnavailable () {
    $(`#${this.statusElementId}`).removeClass('available');
  }
}

// Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', () => {
  // Define the API URL and the ID of the status element
  const apiUrl = 'http://0.0.0.0:5001/api/v1/status/';
  const statusElementId = 'api_status';

  // Create an instance of ApiStatusChecker
  const apiStatusChecker = new ApiStatusChecker(apiUrl, statusElementId);

  // Check the API status and update the element
  apiStatusChecker.checkStatus();
});
