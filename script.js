// Weather Data storing variables
const apiKey = process.env.OPENWEATHER_API_KEY; // OpenWeather API key
const geminiKey = process.env.GEMINI_API_KEY; //gemini API key
const searchButton = document.querySelector(".searchButton"); // Search button
const cityInput = document.querySelector(".cityInput"); // Input for city
const cardCity = document.getElementById("card-city"); // City name display
const weatherImage = document.querySelector(".weather-img"); // Weather icon
const temperatureDisplay = document.querySelector(".temperature"); // Temperature display
const windStatusDisplay = document.querySelector(".wind-status"); // Wind status
const humidityDisplay = document.querySelector(".humidity"); // Humidity
const pressureDisplay = document.querySelector(".pressure"); // Pressure display
const visibilityDisplay = document.querySelector(".visibility"); // Visibility
const today = document.querySelector(".today"); // Today's date display
const date = document.querySelector(".date"); // Today's date display
const sunRiseTime = document.querySelector(".sunrise-time"); // Sunrise time display
const sunSetTime = document.querySelector(".sunset-time"); // Sunset time display
// Chart.js setup variables
let tempChart, doughnutChart, lineChart; //variables for charts
const loading = document.getElementById("loading"); //loading display
const searchInstructionBg = document.getElementById("search-instruction-bg"); //search instruction bg display
// JavaScript to handle toggle between dashboard and table(navbar, sidemenu)
const dashboardLink = document.getElementById("dashboard-btn"); //side menu dashboard-button catch variable
const tableLink = document.getElementById("table-btn"); // sidde menu table button catch variable
const table = document.querySelector(".table"); // table display
const chartSection = document.getElementById("main-content"); //dashboard section content catcher variable
const tableSection = document.getElementById("table-section"); //table section content catcher variable
let active = "dashboard"; //for checking which section is active for displaying the relevant section content
//chatbot  managing variables
const toggleButton = document.getElementById("chatbot-toggle"); //chatbot button catcher that opens and ends it
const chatbotSection = document.getElementById("chatbot-section"); // chatbox section for Q&A
const chatIcon = document.getElementById("chat-icon"); //chatbot-icon catcher
const closeIcon = document.getElementById("close-icon"); //chatbot-closing icon catcher
//modal popup variables
var modal = document.getElementById("myModal"); // Get the modal
var blurContent = document.getElementById("pageContent"); // Get the blur content
var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
//for tables unique and non-unique entries
let currentPage = 1; //current page catcher
const rowsPerPage = 10; // rows per page
let totalPages = 1; //total pages base on length
let globalForecastData = null; // Store forecast data globally

//--------------------------- Some Toggles functions for responsiveness----------------------------

//  click event listener to toggle menu (navbar) button on small and medium screen
document.getElementById("menu-toggle").addEventListener("click", function () {
  const sideMenu = document.getElementById("side-menu");
  sideMenu.classList.toggle("hidden"); // Toggle hidden class to show/hide side menu
});

//  click event listener to the "Tables" button on small and medium screen
document.getElementById("table-btn").addEventListener("click", function () {
  const sideMenu = document.getElementById("side-menu");
  if (sideMenu.classList.contains("hidden")) {
    // Only hide if the menu is already shown
    return;
  }
  sideMenu.classList.add("hidden"); // Hide side menu
});

//  click event listener to the "Dashboard" button on small and medium screen
document.getElementById("dashboard-btn").addEventListener("click", function () {
  const sideMenu = document.getElementById("side-menu");
  if (sideMenu.classList.contains("hidden")) {
    // Only hide if the menu is already shown
    return;
  }
  sideMenu.classList.add("hidden"); // Hide side menu
});

// Event listener for the Dashboard button to move to dashboard section.
dashboardLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default link behavior
  tableLink.classList.remove("gradient-bg"); // Remove active style from the table link
  dashboardLink.classList.add("gradient-bg"); // Add active style to the dashboard link

  if (searchInstructionBg.classList.contains("hidden")) {
    // Hide the table section
    tableSection.classList.add("hidden");
    // Show loading animation
    loading.classList.remove("hidden");
    // Set a timer to hide the loading animation after 3 seconds
    setTimeout(() => {
      loading.classList.add("hidden"); // Hide loading
      chartSection.classList.add("slide-in"); // Add animation class to the chart section
      chartSection.classList.remove("hidden"); // Show the chart section
    }, 3000);
  }
  // Set active state to 'dashboard'
  active = "dashboard";
});

// Event listener for the Table button to move to table section.
tableLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default link behavior
  dashboardLink.classList.remove("gradient-bg"); // Remove active style from the dashboard link

  tableLink.classList.add("gradient-bg"); // Add active style to the table link
  // Hide the chart section
  if (searchInstructionBg.classList.contains("hidden")) {
    chartSection.classList.add("hidden");
    // Show loading animation
    loading.classList.remove("hidden");
    // Set a timer to hide the loading animation after 3 seconds
    setTimeout(() => {
      loading.classList.add("hidden"); // Hide loading
      tableSection.classList.add("slide-in"); // Add animation class to the table section
      tableSection.classList.remove("hidden"); // Show the table section
    }, 3000);
  }
  // Set active state to 'table'
  active = "table";
});

// Event listener for the chatbot toggle button
toggleButton.addEventListener("click", function () {
  // Toggle visibility and slide effect of the chatbot section
  chatbotSection.classList.toggle("hidden"); // Toggle visibility
  chatbotSection.classList.toggle("translate-y-full"); // Slide in/out
  // Change icon based on chatbot state
  if (chatbotSection.classList.contains("hidden")) {
    chatIcon.classList.remove("hidden"); // Show chat icon when chatbot is hidden
    closeIcon.classList.add("hidden"); // Hide close icon
  } else {
    chatIcon.classList.add("hidden"); // Hide chat icon when chatbot is visible
    closeIcon.classList.remove("hidden"); // Show close icon
  }
});

//----------------- managing modal class for displaying name and picture----------------------
// Show the modal on page load
window.onload = function () {
  modal.classList.add("slide-in");
  modal.classList.remove("hidden");
  blurContent.classList.add("blur"); // Apply blur effect to the content
};
// When the user clicks on <span> (x), close the modal and unblur content
span.onclick = function () {
  modal.classList.add("hidden");
  blurContent.classList.remove("blur"); // Remove blur effect from content
};

// When the user clicks anywhere outside of the modal, close it and unblur content
window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.add("hidden");
    blurContent.classList.remove("blur"); // Remove blur effect from content
  }
};

// Optional: When the user clicks the confirm button, close the modal and unblur content
document.getElementById("modal-confirm-btn").onclick = function () {
  modal.classList.add("hidden");
  blurContent.classList.remove("blur"); // Remove blur effect from content
};

// Handle the Confirm button click
document.getElementById("modal-confirm-btn").onclick = function () {
  var name = document.getElementById("userName").value;
  var imageFile = document.getElementById("userImage").files[0];

  if (name) {
    // Set the user name
    document.getElementById("displayName").textContent = "Hi " + name;
  }
  if (imageFile) {
    // Set the user image
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("displayImage").src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  }

  // Close the modal and unblur content
  modal.classList.add("hidden");
  blurContent.classList.remove("blur"); // Remove blur effect from content
  blurContent.classList.remove("hidden"); // Show the content
};
//---------------------------------------------------------------------------------------------------------
//------------------------------------------ DASHBOARD SECTION DATA LOGIC ---------------------------------

// Event listener for the search button to fetch weather data
searchButton.addEventListener("click", fetchWeatherData); // Fetch weather data when search button is clicked

//function that fetch, set and display data at initial level  called when search button is clicked.
async function fetchWeatherData() {
  // Get the city name from the input field

  const city = cityInput.value;

  // Check if the city name is provided
  if (!city) {
    alert("Please enter a city name."); // Alert if city name is missing
    return; // Exit the function if no city name is entered
  }

  try {
    // Hide the table and chart sections while fetching data
    tableSection.classList.add("hidden");
    chartSection.classList.add("hidden");

    // Fetch current weather data from the OpenWeather API
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const currentWeatherData = await currentWeatherResponse.json(); // Parse the JSON response

    // Check if the response status is not OK (200)
    if (currentWeatherResponse.status !== 200) {
      throw new Error(currentWeatherData.message); // Throw an error if the city is not found
    }

    // Hide search instructions background and show loading indicator
    searchInstructionBg.classList.add("hidden");
    loading.classList.remove("hidden");

    // Update the UI with current weather details
    updateCurrentWeather(currentWeatherData);

    // Fetch 5-day weather forecast from the OpenWeather API
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastResponse.json(); // Parse the JSON response

    // Check if the response status is not OK (200)
    if (forecastResponse.status !== 200) {
      throw new Error(forecastData.message); // Throw an error if the city is not found
    }

    // Process and display the forecast data
    processForecastData(forecastData);
    populateTableNonUnique(forecastData); // Populate the forecast table with data

    cityInput.value = ""; //clear city input field

    // Show loading animation for 3 seconds based on the active section
    if (active === "table") {
      setTimeout(() => {
        loading.classList.add("hidden"); // Hide loading indicator
        tableSection.classList.add("slide-in"); // Add animation class to table section
        tableSection.classList.remove("hidden"); // Show the table section
      }, 3000); // Timer set for 3 seconds
    } else if (active === "dashboard") {
      setTimeout(() => {
        loading.classList.add("hidden"); // Hide loading indicator
        chartSection.classList.add("slide-in"); // Add animation class to chart section
        chartSection.classList.remove("hidden"); // Show the chart section
      }, 3000); // Timer set for 3 seconds
    }
  } catch (error) {
    alert(`Error: ${error.message}`); // Alert the user if an error occurs
  }
}

//function that set data values to html element and called by fetchWeatherData() function
function updateCurrentWeather(data) {
  // Construct the city name and country from the received data
  const cityName = data.name + ", " + data.sys.country;
  cardCity.textContent = cityName; // Update the city name display

  // Round the temperature and update the display
  temperatureDisplay.textContent = Math.round(data.main.temp) + "°C";

  // Update the weather icon image based on the weather data
  weatherImage.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  // Round the wind speed and update the display
  windStatusDisplay.textContent = Math.round(data.wind.speed) + " km/h";

  // Update humidity and pressure displays
  humidityDisplay.textContent = data.main.humidity + "%";
  pressureDisplay.textContent = data.main.pressure + " hPa";

  // Convert visibility from meters to kilometers and update the display
  visibilityDisplay.textContent = data.visibility / 1000 + " Km"; // Convert to Km

  // Set today's date
  const todayDate = new Date();
  today.textContent = todayDate.toLocaleString("default", { weekday: "long" }); // Display the day of the week
  date.textContent = todayDate.toLocaleDateString(); // Display the current date

  // Convert and display sunrise and sunset times if available
  if (data.sys.sunrise && data.sys.sunset) {
    const sunrise = new Date(data.sys.sunrise * 1000); // Convert sunrise time to milliseconds
    const sunset = new Date(data.sys.sunset * 1000); // Convert sunset time to milliseconds
    sunRiseTime.textContent = sunrise.toLocaleTimeString(); // Format and display sunrise time as "HH:MM AM/PM"
    sunSetTime.textContent = sunset.toLocaleTimeString(); // Format and display sunset time as "HH:MM AM/PM"
  } else {
    console.error("Sunrise or sunset data is not available"); // Log an error if data is missing
  }
}

//it process and extract data of 5 days called by fetchWeatherData() function and response data is sent.
function processForecastData(data) {
  console.log("forecast:"); // Log the forecast data for debugging
  console.log(data); // Output the full forecast data for inspection

  const tempData = []; // Array to hold average temperatures
  const weatherConditions = {}; // Object to count occurrences of different weather conditions
  const days = []; // Array to track unique days in the forecast

  // Iterate through each item in the forecast data list
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000); // Convert Unix timestamp to Date object
    const day = date.toLocaleDateString("en-US", { weekday: "short" }); // Get the short weekday name (e.g., Mon, Tue)

    // Collect unique day names for the next 5 days
    if (!days.includes(day) && days.length < 5) {
      days.push(day); // Add the day to the array if not already included
    }

    // Calculate average temperature for the first 5 days
    if (days.length <= 5) {
      const avgTemp = Math.round(item.main.temp); // Round the temperature
      tempData.push(avgTemp); // Store the average temperature in the array
      // Count occurrences of each weather condition
      weatherConditions[item.weather[0].main] =
        (weatherConditions[item.weather[0].main] || 0) + 1;
    }
  });

  // Call createCharts function to visualize the data
  createCharts(tempData, weatherConditions);
}

// Clear previous charts; helper function for create charts
function clearCharts() {
  const barContainer = document.querySelector(".vertical-bar-chart");
  const doughnutContainer = document.querySelector(".Doughnut-chart");
  const lineContainer = document.querySelector(".line-chart");

  // Clear all containers
  barContainer.innerHTML = "";
  doughnutContainer.innerHTML = "";
  lineContainer.innerHTML = "";

  // Clear chart instances if they exist
  if (tempChart) tempChart.destroy();
  if (doughnutChart) doughnutChart.destroy();
  if (lineChart) lineChart.destroy();
}

// Create charts with fetched 5 days data called by processForecastData() to create charts
function createCharts(tempData, weatherConditions) {
  const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]; // Labels for the x-axis of the charts
  const containerWidth = "100%"; // Full width for the chart container
  const containerHeight = "300px"; // Uniform height for the charts

  // Ensure previous charts are cleared
  clearCharts();

  // Create Vertical Bar Chart
  const ctxBar = document.createElement("canvas"); // Create a new canvas element for the bar chart
  ctxBar.style.height = containerHeight; // Set the height of the canvas
  ctxBar.style.width = containerWidth; // Set the width of the canvas
  document.querySelector(".vertical-bar-chart").appendChild(ctxBar); // Append canvas to the chart container

  // Initialize the bar chart
  tempChart = new Chart(ctxBar, {
    type: "bar", // Specify chart type as 'bar'
    data: {
      labels: labels, // Set the x-axis labels
      datasets: [
        {
          label: "Temperature (°C)", // Label for the dataset
          data: tempData, // Data for the y-axis
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Background color for bars
          borderColor: "rgba(255, 255, 255, 1)", // Border color for bars
          borderWidth: 1, // Border width for bars
        },
      ],
    },
    options: {
      scales: {
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.2)", // Grid line color for y-axis
          },
          ticks: {
            color: "white", // Color for y-axis tick labels
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.2)", // Grid line color for x-axis
          },
          ticks: {
            color: "white", // Color for x-axis tick labels
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white", // Color for legend text
          },
        },
      },
      animation: {
        delay: (context) => {
          if (context.type === "dataset") {
            return context.index * 200; // Delay for each dataset during animation
          }
          return 0; // No delay for other types
        },
      },
    },
  });

  // Create Doughnut Chart
  const ctxDoughnut = document.createElement("canvas"); // Create a new canvas for the doughnut chart
  ctxDoughnut.style.height = containerHeight; // Set height
  ctxDoughnut.style.width = containerWidth; // Set width
  document.querySelector(".Doughnut-chart").appendChild(ctxDoughnut); // Append canvas to the chart container

  // Function to create gradient for the first segment
  const createGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400); // Create a vertical gradient
    gradient.addColorStop(0, "#1F1F1F"); // Darker color for the top
    gradient.addColorStop(1, "#AAAAAA"); // Lighter color for the bottom
    return gradient; // Return the gradient
  };

  const ctx = ctxDoughnut.getContext("2d"); // Get the context for the doughnut chart

  // Prepare background colors for the doughnut chart segments
  const backgroundColors = [
    createGradient(ctx), // Gradient for the first segment
    "rgba(255, 99, 132, 0.6)", // Color for the second segment
    "rgba(54, 162, 235, 0.6)", // Color for the third segment
    "rgba(255, 206, 86, 0.6)", // Color for the fourth segment
    "rgba(75, 192, 192, 0.6)", // Color for the fifth segment
  ];

  // Create the doughnut chart
  doughnutChart = new Chart(ctxDoughnut, {
    type: "doughnut", // Specify chart type as 'doughnut'
    data: {
      labels: Object.keys(weatherConditions), // Set labels from weather conditions
      datasets: [
        {
          data: Object.values(weatherConditions), // Set data values from weather conditions
          backgroundColor: backgroundColors, // Use prepared background colors
          borderColor: "white", // Border color for the segments
          borderWidth: 1, // Border width for the segments
        },
      ],
    },
    options: {
      responsive: true, // Make chart responsive
      maintainAspectRatio: true, // Maintain the aspect ratio
      plugins: {
        legend: {
          labels: {
            color: "white", // Color for legend text
          },
        },
      },
      animation: {
        delay: (context) => {
          const baseDelay = 500; // Set base delay for animation
          if (context.type === "dataset") {
            return context.index * baseDelay; // Increase delay for each dataset
          }
          return 0; // No delay for other types
        },
      },
    },
  });

  // Create Line Chart
  const ctxLine = document.createElement("canvas"); // Create a new canvas for the line chart
  ctxLine.style.height = containerHeight; // Set height
  ctxLine.style.width = containerWidth; // Set width
  document.querySelector(".line-chart").appendChild(ctxLine); // Append canvas to the chart container

  // Initialize the line chart
  lineChart = new Chart(ctxLine, {
    type: "line", // Specify chart type as 'line'
    data: {
      labels: labels, // Set the x-axis labels
      datasets: [
        {
          label: "Temperature (°C)", // Label for the dataset
          data: tempData, // Data for the y-axis
          fill: true, // Fill the area under the curve
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Fill color under the curve
          borderColor: "rgba(255, 255, 255, 1)", // Color for the line
          tension: 0.1, // Smooth curve tension
        },
      ],
    },
    options: {
      scales: {
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.2)", // Light grid lines for y-axis
          },
          ticks: {
            color: "white", // Color for y-axis tick labels
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.2)", // Light grid lines for x-axis
          },
          ticks: {
            color: "white", // Color for x-axis tick labels
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white", // Color for legend text
          },
        },
      },
      animation: {
        onComplete: function () {
          const chartInstance = this; // Reference to the chart instance
          const ctx = chartInstance.ctx; // Get the context
          ctx.textAlign = "center"; // Center align text
          ctx.textBaseline = "bottom"; // Align text to the bottom
          // Loop through each dataset to draw labels on the chart
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              const data = dataset.data[index]; // Get the data value for the bar
              ctx.fillStyle = "white"; // Color for text labels
              ctx.fillText(data, bar.x, bar.y - 5); // Draw text label above the bar
            });
          });
        },
        delay: 1500, // Animation delay
      },
    },
  });
}
//-----------------------------------------------------------------------------------------------------
//------------------------------------------ TABLE SECTION DATA LOGIC ---------------------------------

/*
//function that initializes table and rows.
let currentPage = 1;
const rowsPerPage = 10;
let totalPages = 1;

// Function to calculate total pages and update pagination controls
function updatePaginationControls(dataLength) {
    totalPages = Math.ceil(dataLength / rowsPerPage);
    document.getElementById('pageDisplay').innerText = `Page ${currentPage} of ${totalPages}`;

    // Enable/disable pagination buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Function to populate table with pagination
function populateTable(forecastData) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ''; // Clear any existing data

    const uniqueDates = {};

    // Ensure forecastData has the expected structure
    if (!forecastData || !forecastData.list) {
        console.error('Invalid forecast data structure');
        return;
    }

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!uniqueDates[date]) {
            uniqueDates[date] = {
                temp: Math.round(item.main.temp),
                weatherCondition: item.weather[0].description,
                weatherIcon: item.weather[0].icon || 'default_icon',
                windSpeed: Math.round(item.wind.speed),
                humidity: item.main.humidity,
            };
        }
    });

    const uniqueEntries = Object.entries(uniqueDates);

    // Update pagination control
    updatePaginationControls(uniqueEntries.length);

    // Get the entries for the current page
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const currentEntries = uniqueEntries.slice(start, end);

    currentEntries.forEach(([date, data], index) => {
        const row = `<tr class="transition-transform duration-300 transform hover:scale-105">
            <td class="p-3 text-center">${date}</td>
            <td class="p-3 text-center">${data.temp} °C</td>
            <td class="p-3 text-center flex items-center justify-center">
                <img src="http://openweathermap.org/img/wn/${data.weatherIcon}.png" alt="${data.weatherCondition}" class="w-6 h-6 mr-2" />
                ${data.weatherCondition}
            </td>
            <td class="p-3 text-center">${data.windSpeed} km/h</td>
            <td class="p-3 text-center">${data.humidity} %</td>
        </tr>`;

        // Use setTimeout to add a staggered effect for rows
        setTimeout(() => {
            tbody.innerHTML += row; // Add row to table
        }, index * 100); // Delay each row by 100ms
    });
}

// Event listeners for pagination controls
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        populateTable(forecastData); // Pass the original forecast data here
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        populateTable(forecastData); // Pass the original forecast data here
    }
});
*/

// Function to update pagination controls
function updatePaginationControls(dataLength) {
  totalPages = Math.ceil(dataLength / rowsPerPage);
  document.getElementById(
    "pageDisplay"
  ).innerText = `Page ${currentPage} of ${totalPages}`;

  // Enable/disable pagination buttons
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// Function for non-unique entries with pagination
function populateTableNonUnique(forecastData) {
  globalForecastData = forecastData;
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = ""; // Clear any existing data

  if (!forecastData || !forecastData.list) {
    console.error("Invalid forecast data structure");
    return;
  }

  const allEntries = forecastData.list.map((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    return {
      date: date,
      temp: Math.round(item.main.temp),
      weatherCondition: item.weather[0].description,
      weatherIcon: item.weather[0].icon || "default_icon",
      windSpeed: Math.round(item.wind.speed),
      humidity: item.main.humidity,
    };
  });

  updatePaginationControls(allEntries.length);

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentEntries = allEntries.slice(start, end);

  currentEntries.forEach((data, index) => {
    const row = `<tr class="transition-transform duration-300 transform hover:scale-105">
            <td class="p-3 text-center">${data.date}</td>
            <td class="p-3 text-center">${data.temp} °C</td>
            <td class="p-3 text-center flex items-center justify-center">
                <img src="http://openweathermap.org/img/wn/${data.weatherIcon}.png" alt="${data.weatherCondition}" class="w-6 h-6 mr-2" />
                ${data.weatherCondition}
            </td>
            <td class="p-3 text-center">${data.windSpeed} km/h</td>
            <td class="p-3 text-center">${data.humidity} %</td>
        </tr>`;

    setTimeout(() => {
      tbody.innerHTML += row;
    }, index * 100);
  });
}

// Function for unique entries with pagination
function populateTableUnique(forecastData) {
  globalForecastData = forecastData;
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = ""; // Clear any existing data

  if (!forecastData || !forecastData.list) {
    console.error("Invalid forecast data structure");
    return;
  }

  const uniqueDates = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!uniqueDates[date]) {
      uniqueDates[date] = {
        temp: Math.round(item.main.temp),
        weatherCondition: item.weather[0].description,
        weatherIcon: item.weather[0].icon || "default_icon",
        windSpeed: Math.round(item.wind.speed),
        humidity: item.main.humidity,
      };
    }
  });

  const uniqueEntries = Object.entries(uniqueDates);
  updatePaginationControls(uniqueEntries.length);

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentEntries = uniqueEntries.slice(start, end);

  currentEntries.forEach(([date, data], index) => {
    const row = `<tr class="transition-transform duration-300 transform hover:scale-105">
            <td class="p-3 text-center">${date}</td>
            <td class="p-3 text-center">${data.temp} °C</td>
            <td class="p-3 text-center flex items-center justify-center">
                <img src="http://openweathermap.org/img/wn/${data.weatherIcon}.png" alt="${data.weatherCondition}" class="w-6 h-6 mr-2" />
                ${data.weatherCondition}
            </td>
            <td class="p-3 text-center">${data.windSpeed} km/h</td>
            <td class="p-3 text-center">${data.humidity} %</td>
        </tr>`;

    setTimeout(() => {
      tbody.innerHTML += row;
    }, index * 100);
  });
}

// Function to handle table population based on checkbox status
function handleTablePopulation() {
  const isUniqueChecked = document.getElementById("uniqueCheckbox").checked;

  if (isUniqueChecked) {
    populateTableUnique(globalForecastData); // Call unique version
  } else {
    populateTableNonUnique(globalForecastData); // Call non-unique version
  }
}

// Add event listener to checkbox for toggling unique entries table
document.getElementById("uniqueCheckbox").addEventListener("change", () => {
  currentPage = 1; // Reset to the first page when toggling
  handleTablePopulation(); // Populate table based on checkbox status
});

// Event listeners for pagination controls
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    handleTablePopulation();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    handleTablePopulation();
  }
});

// Event listeners for pagination controls
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    populateTable(globalForecastData); // Use global forecast data
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    populateTable(globalForecastData); // Use global forecast data
  }
});

// Filtering table data function
document.getElementById("filter").addEventListener("change", function () {
  // Get the selected filter value
  const filterValue = this.value;
  // Get all rows from the table body as an array
  const rows = Array.from(document.querySelectorAll("#table-body tr"));

  // Reset table to show all rows initially
  rows.forEach((row) => (row.style.display = ""));

  // Sort rows based on the selected filter value
  if (filterValue === "ascending") {
    // Sort rows in ascending order of temperature
    rows.sort((a, b) => {
      const tempA = parseInt(a.cells[1].textContent);
      const tempB = parseInt(b.cells[1].textContent);
      return tempA - tempB;
    });
  } else if (filterValue === "descending") {
    // Sort rows in descending order of temperature
    rows.sort((a, b) => {
      const tempA = parseInt(a.cells[1].textContent);
      const tempB = parseInt(b.cells[1].textContent);
      return tempB - tempA;
    });
  } else if (filterValue === "highest") {
    // Find the maximum temperature from all rows
    const maxTemp = Math.max(
      ...rows.map((row) => parseInt(row.cells[1].textContent))
    );
    // Hide all rows that do not have the maximum temperature
    rows.forEach((row) => {
      const rowTemp = parseInt(row.cells[1].textContent);
      if (rowTemp !== maxTemp) {
        row.style.display = "none"; // Hide rows that do not have the max temperature
      }
    });
    return; // Exit to prevent further filtering
  } else if (filterValue === "rain") {
    // Hide rows that do not contain rain in their weather condition
    rows.forEach((row) => {
      const weatherCondition = row.cells[2].textContent.toLowerCase();
      if (!weatherCondition.includes("rain")) {
        row.style.display = "none"; // Hide rows without rain
      }
    });
  }

  // Append filtered rows back to the table to update the display
  const tbody = document.getElementById("table-body");
  rows.forEach((row) => tbody.appendChild(row));
});

// Chatbot functionality starts from here
// Chatbot functionality starts from here
const chatInput = document.getElementById("chat-input"); // Chatbox user input catcher
const chatHistory = document.getElementById("chat-history"); // Chatbox catcher

// Function to send a message to the chatbot
function sendMessageToChatbot(message) {
  // Display the user's message in the chat history
  addMessageToChatHistory("You: " + message);

  // Check if the user's message is about the weather
  if (message.toLowerCase().includes("weather")) {
    // Extract the city name from the message
    const city = extractCityFromMessage(message);
    if (city) {
      // Fetch weather data from the API for the specified city
      fetchWeatherDataFromAPI(city)
        .then((weatherData) => {
          // Display the formatted weather response in the chat history
          addMessageToChatHistory(
            "WeatherBot: " + formatWeatherResponse(weatherData)
          );
        })
        .catch((error) => {
          // Handle API errors
          addMessageToChatHistory(
            "WeatherBot: Unable to fetch weather data. " + error.message
          );
        });
    } else {
      // Prompt the user to specify a city if not provided
      addMessageToChatHistory("WeatherBot: Please specify a city.");
    }
  } else {
    // Handle non-weather related queries using the Gemini API
    fetchGeminiResponse(message)
      .then((response) => {
        // Display the Gemini API response in the chat history
        addMessageToChatHistory("WeatherBot: " + response);
      })
      .catch((error) => {
        // Handle API errors
        addMessageToChatHistory(
          "WeatherBot: Sorry, I couldn't process your request. " + error.message
        );
      });
  }
}

// Function to extract city from user message
function extractCityFromMessage(message) {
  // Simple extraction logic (can be improved)
  const words = message.split(" ");
  return words.length > 1 ? words[1] : null; // Get second word as city
}

// Function to fetch weather data from OpenWeather API
function fetchWeatherDataFromAPI(city) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .catch((error) => {
      return { error: error.message };
    });
}

// Function to format weather response
function formatWeatherResponse(data) {
  if (data.error) return data.error;

  const temp = Math.round(data.main.temp) + "°C";
  const description = data.weather[0].description;
  return `The current temperature in ${data.name} is ${temp} with ${description}.`;
}

// Function to fetch response from Gemini API
// Function to fetch response from Gemini API
function fetchGeminiResponse(message) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const textResponse =
        data.candidates[0]?.content?.parts[0]?.text ||
        "No response text available";
      return textResponse; // Return the value here
    })
    .catch((error) => {
      console.error(error);
      return "Sorry, I couldn't process your request."; // Handle error case
    });
}

// Usage example:
fetchGeminiResponse("Your message here").then((response) => {
  console.log("Gemini Response: ", response);
});

// Function to add message to chat history
function addMessageToChatHistory(message) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  chatHistory.appendChild(messageElement);
  chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
}

// Event listener for chat input
chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const message = chatInput.value.trim();
    if (message) {
      sendMessageToChatbot(message);
      chatInput.value = ""; // Clear input field
    }
  }
});
