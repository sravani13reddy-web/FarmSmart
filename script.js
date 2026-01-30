// Global variables
let map;
let userMarker;
let userLocation = null;
let currentDetectedRegion = null;
let currentDetectedSoil = null;
let currentLocationDetails = {
    state: '',
    district: '',
    village: '',
    region: '',
    coordinates: '',
    soilType: ''
};

// DOM Elements
const locationModal = document.getElementById('locationModal');
const allowLocationBtn = document.getElementById('allowLocation');
const manualLocationBtn = document.getElementById('manualLocation');
const refreshLocationBtn = document.getElementById('refreshLocation');
const changeLocationBtn = document.getElementById('changeLocation');
const locateMeBtn = document.getElementById('locateMe');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const cropAdviseBtn = document.getElementById('cropAdviseBtn');

// Location display elements
const stateDisplay = document.getElementById('state');
const districtDisplay = document.getElementById('district');
const villageDisplay = document.getElementById('village');
const regionDisplay = document.getElementById('region');
const coordinatesDisplay = document.getElementById('coordinates');
const soilTypeDisplay = document.getElementById('soilTypeDisplay');
const addressLine1 = document.getElementById('addressLine1');
const addressLine2 = document.getElementById('addressLine2');
const addressLine3 = document.getElementById('addressLine3');

// Dashboard elements
const soilTypeDash = document.getElementById('soilTypeDash');
const soilPH = document.getElementById('soilPH');
const nutrientLevel = document.getElementById('nutrientLevel');
const moistureContent = document.getElementById('moistureContent');
const currentSeason = document.getElementById('currentSeason');
const plantingWindow = document.getElementById('plantingWindow');
const harvestPeriod = document.getElementById('harvestPeriod');
const rainfallProb = document.getElementById('rainfallProb');
const weatherIcon = document.getElementById('weatherIcon');
const currentTemp = document.getElementById('currentTemp');
const weatherCondition = document.getElementById('weatherCondition');
const weatherLocation = document.getElementById('weatherLocation');
const weatherForecast = document.getElementById('weatherForecast');

// Form elements
const locationSelect = document.getElementById('locationSelect');
const soilTypeSelect = document.getElementById('soilType');
const locationNotice = document.getElementById('locationNotice');
const soilNotice = document.getElementById('soilNotice');
const locationAutoFillNotice = document.getElementById('locationAutoFillNotice');

// Tool elements
const toolTabs = document.querySelectorAll('.tool-tab');
const toolContents = document.querySelectorAll('.tool-content');

const cropForm = document.getElementById('cropForm');
const resultsSection = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const resultsContent = document.getElementById('resultsContent');
const backToFormBtn = document.getElementById('backToForm');
const riskOptions = document.querySelectorAll('.risk-option');
const riskInput = document.getElementById('riskTolerance');

// India state and district data (simplified for demo)
const indiaLocationData = {
    "north": {
        states: ["Uttar Pradesh", "Punjab", "Haryana", "Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir", "Delhi"],
        districts: ["Lucknow", "Ludhiana", "Chandigarh", "Dehradun", "Shimla", "Srinagar", "New Delhi"],
        villages: ["Mohanpur", "Singhpur", "Rajpur", "Shivpur", "Ramnagar", "Krishnanagar", "Devnagar"],
        soilType: "Alluvial (Fertile)",
        soilCode: "alluvial",
        climate: "Subtropical",
        season: "Rabi",
        planting: "Oct - Nov",
        harvest: "Mar - Apr"
    },
    "south": {
        states: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"],
        districts: ["Chennai", "Thiruvananthapuram", "Bengaluru", "Hyderabad", "Vijayawada"],
        villages: ["Madurai", "Kochi", "Mysore", "Tirupati", "Warangal"],
        soilType: "Red (Loamy)",
        soilCode: "red",
        climate: "Tropical",
        season: "Kharif",
        planting: "Jun - Jul",
        harvest: "Oct - Nov"
    },
    "east": {
        states: ["West Bengal", "Odisha", "Bihar", "Jharkhand", "Assam"],
        districts: ["Kolkata", "Bhubaneswar", "Patna", "Ranchi", "Guwahati"],
        villages: ["Howrah", "Puri", "Gaya", "Jamshedpur", "Dibrugarh"],
        soilType: "Alluvial (Fertile)",
        soilCode: "alluvial",
        climate: "Tropical Wet",
        season: "Kharif",
        planting: "Jun - Jul",
        harvest: "Sep - Oct"
    },
    "west": {
        states: ["Maharashtra", "Gujarat", "Rajasthan", "Goa", "Madhya Pradesh"],
        districts: ["Mumbai", "Ahmedabad", "Jaipur", "Panaji", "Bhopal"],
        villages: ["Pune", "Surat", "Udaipur", "Margao", "Indore"],
        soilType: "Black (Clayey)",
        soilCode: "black",
        climate: "Arid/Semi-Arid",
        season: "Kharif",
        planting: "Jun - Jul",
        harvest: "Sep - Oct"
    },
    "central": {
        states: ["Madhya Pradesh", "Chhattisgarh", "Uttar Pradesh (Central)"],
        districts: ["Bhopal", "Raipur", "Allahabad"],
        villages: ["Indore", "Bhilai", "Varanasi"],
        soilType: "Black (Clayey)",
        soilCode: "black",
        climate: "Tropical",
        season: "Kharif",
        planting: "Jun - Jul",
        harvest: "Sep - Oct"
    }
};

// Weather data based on region
const weatherData = {
    "north": {
        temp: "24°C",
        condition: "Partly Cloudy",
        icon: "fa-cloud-sun",
        forecast: [
            {day: "Today", temp: "24°C", icon: "fa-cloud-sun"},
            {day: "Tomorrow", temp: "26°C", icon: "fa-sun"},
            {day: "Day 3", temp: "23°C", icon: "fa-cloud-rain"}
        ]
    },
    "south": {
        temp: "30°C",
        condition: "Sunny",
        icon: "fa-sun",
        forecast: [
            {day: "Today", temp: "30°C", icon: "fa-sun"},
            {day: "Tomorrow", temp: "31°C", icon: "fa-sun"},
            {day: "Day 3", temp: "29°C", icon: "fa-cloud-sun"}
        ]
    },
    "east": {
        temp: "28°C",
        condition: "Rainy",
        icon: "fa-cloud-rain",
        forecast: [
            {day: "Today", temp: "28°C", icon: "fa-cloud-rain"},
            {day: "Tomorrow", temp: "27°C", icon: "fa-cloud-showers-heavy"},
            {day: "Day 3", temp: "26°C", icon: "fa-cloud-rain"}
        ]
    },
    "west": {
        temp: "32°C",
        condition: "Clear",
        icon: "fa-sun",
        forecast: [
            {day: "Today", temp: "32°C", icon: "fa-sun"},
            {day: "Tomorrow", temp: "33°C", icon: "fa-sun"},
            {day: "Day 3", temp: "31°C", icon: "fa-cloud-sun"}
        ]
    },
    "central": {
        temp: "29°C",
        condition: "Partly Cloudy",
        icon: "fa-cloud-sun",
        forecast: [
            {day: "Today", temp: "29°C", icon: "fa-cloud-sun"},
            {day: "Tomorrow", temp: "30°C", icon: "fa-sun"},
            {day: "Day 3", temp: "28°C", icon: "fa-cloud"}
        ]
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show location modal on page load
    locationModal.style.display = 'flex';
    
    // Initialize map
    initMap();
    
    // Set default land area
    document.getElementById('landArea').value = "5";
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize tool tabs
    initToolTabs();
});

// Initialize Leaflet map
function initMap() {
    // Default center (India)
    map = L.map('map').setView([20.5937, 78.9629], 5);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add a default marker
    userMarker = L.marker([20.5937, 78.9629]).addTo(map)
        .bindPopup('<div class="location-marker-popup"><b>FarmSmart</b><br>Your location will be shown here</div>')
        .openPopup();
}

// Initialize tool tabs
function initToolTabs() {
    toolTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            toolTabs.forEach(t => t.classList.remove('active'));
            toolContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            document.getElementById(`${tabId}Tool`).classList.add('active');
        });
    });
}

// Set up event listeners
function setupEventListeners() {
    // Location modal buttons
    allowLocationBtn.addEventListener('click', getUserLocation);
    manualLocationBtn.addEventListener('click', showManualLocationInput);
    
    // Location action buttons
    refreshLocationBtn.addEventListener('click', getUserLocation);
    changeLocationBtn.addEventListener('click', () => {
        locationModal.style.display = 'flex';
    });
    
    // Crop advise button
    cropAdviseBtn.addEventListener('click', () => {
        // First try to get current location if not already done
        if (!userLocation) {
            getUserLocation();
        }
        // Then scroll to crop advisory section
        setTimeout(() => {
            document.getElementById('cropAdvisory').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    });
    
    // Map control buttons
    locateMeBtn.addEventListener('click', getUserLocation);
    zoomInBtn.addEventListener('click', () => map.zoomIn());
    zoomOutBtn.addEventListener('click', () => map.zoomOut());
    
    // Tool form submissions
    document.getElementById('profitCalculator').addEventListener('submit', calculateProfit);
    document.getElementById('yieldEstimator').addEventListener('submit', estimateYield);
    document.getElementById('waterCalculator').addEventListener('submit', calculateWater);
    document.getElementById('fertilizerCalculator').addEventListener('submit', calculateFertilizer);
    
    // Location dropdown change event
    locationSelect.addEventListener('change', function() {
        if (this.value === 'current-location' && userLocation) {
            fillFormFromCurrentLocation();
        } else if (this.value && this.value !== 'current-location') {
            hideAutoFillNotices();
        }
    });
    
    // Risk selection handler
    riskOptions.forEach(option => {
        option.addEventListener('click', function() {
            riskOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            riskInput.value = this.getAttribute('data-risk');
        });
    });
    
    // Form submission handler
    cropForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const location = locationSelect.value === 'current-location' ? currentDetectedRegion : locationSelect.value;
        const lastCrop = document.getElementById('lastCrop').value;
        const soilType = soilTypeSelect.value;
        const budget = document.getElementById('budget').value;
        const riskTolerance = riskInput.value;
        const cropPreference = document.getElementById('cropPreference').value;
        const landArea = parseFloat(document.getElementById('landArea').value);
        
        // Validate form
        if (!location || !lastCrop || !soilType || !budget || !riskTolerance || !landArea) {
            alert('Please fill all required fields');
            return;
        }
        
        // Show loading animation
        loadingDiv.style.display = 'block';
        
        // Simulate API call/processing delay
        setTimeout(function() {
            loadingDiv.style.display = 'none';
            const recommendations = generateRecommendations(location, lastCrop, soilType, budget, riskTolerance, cropPreference, landArea);
            displayResults(recommendations);
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    });
    
    // Back to form button handler
    backToFormBtn.addEventListener('click', function() {
        resultsSection.style.display = 'none';
        cropForm.reset();
        riskOptions.forEach(opt => opt.classList.remove('selected'));
        riskInput.value = '';
        document.getElementById('cropAdvisory').scrollIntoView({ behavior: 'smooth' });
    });
}

// Get user's current location
function getUserLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }
    
    // Show loading state
    stateDisplay.textContent = "Detecting...";
    districtDisplay.textContent = "---";
    villageDisplay.textContent = "---";
    
    // Request location
    navigator.geolocation.getCurrentPosition(
        // Success callback
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Update user location
            userLocation = { lat, lng };
            
            // Update map and UI
            updateMapWithLocation(lat, lng);
            updateLocationDetails(lat, lng);
            
            // Update weather and dashboard
            updateWeatherDashboard();
            
            // Auto-fill the form with current location
            fillFormFromCurrentLocation();
            
            // Hide modal
            locationModal.style.display = 'none';
        },
        // Error callback
        function(error) {
            console.error("Error getting location:", error);
            alert("Unable to retrieve your location. Please enter it manually.");
            
            // Show manual input option
            showManualLocationInput();
        }
    );
}

// Show manual location input
function showManualLocationInput() {
    const region = prompt("Please enter your region (Northern, Southern, Eastern, Western, Central):");
    
    if (region) {
        // Convert region to lowercase for matching
        const regionLower = region.toLowerCase();
        let lat, lng;
        
        // Set coordinates based on region
        if (regionLower.includes("north")) {
            lat = 30.3753; lng = 78.0042; // Uttarakhand
        } else if (regionLower.includes("south")) {
            lat = 13.0827; lng = 80.2707; // Tamil Nadu
        } else if (regionLower.includes("east")) {
            lat = 22.5726; lng = 88.3639; // West Bengal
        } else if (regionLower.includes("west")) {
            lat = 19.0760; lng = 72.8777; // Maharashtra
        } else if (regionLower.includes("central")) {
            lat = 23.2599; lng = 77.4126; // Madhya Pradesh
        } else {
            lat = 20.5937; lng = 78.9629; // Default India
        }
        
        // Update user location
        userLocation = { lat, lng };
        
        // Update map and UI
        updateMapWithLocation(lat, lng);
        updateLocationDetails(lat, lng, region);
        
        // Update weather and dashboard
        updateWeatherDashboard();
        
        // Auto-fill the form
        fillFormFromCurrentLocation();
        
        // Hide modal
        locationModal.style.display = 'none';
    }
}

// Update map with user location
function updateMapWithLocation(lat, lng) {
    // Update map view
    map.setView([lat, lng], 12);
    
    // Remove previous marker
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    
    // Create custom icon for farm location
    const farmIcon = L.divIcon({
        html: '<div style="background-color: #7cb342; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"><i class="fas fa-tractor"></i></div>',
        className: 'farm-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });
    
    // Add new marker with custom icon
    userMarker = L.marker([lat, lng], {icon: farmIcon}).addTo(map)
        .bindPopup(`<div class="location-marker-popup"><b>Your Farm Location</b><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}<br>${currentLocationDetails.village}, ${currentLocationDetails.district}</div>`)
        .openPopup();
    
    // Add a circle to show approximate area
    L.circle([lat, lng], {
        color: 'green',
        fillColor: '#7cb342',
        fillOpacity: 0.15,
        radius: 3000 // 3km radius
    }).addTo(map);
}

// Update location details in UI
function updateLocationDetails(lat, lng, customRegion = null) {
    // Determine region based on coordinates
    let region, regionCode, soilType, soilCode, climateZone;
    
    if (customRegion) {
        region = customRegion;
        regionCode = getRegionCode(region);
    } else {
        // Simple region detection based on coordinates (India-specific)
        if (lat > 28) {
            region = "Northern Region";
            regionCode = "north";
        } else if (lat < 15) {
            region = "Southern Region";
            regionCode = "south";
        } else if (lng > 85) {
            region = "Eastern Region";
            regionCode = "east";
        } else if (lng < 75) {
            region = "Western Region";
            regionCode = "west";
        } else {
            region = "Central Region";
            regionCode = "central";
        }
    }
    
    // Get location data for the region
    const regionData = indiaLocationData[regionCode] || indiaLocationData.north;
    
    // Randomly select a location from the region data
    const randomIndex = Math.floor(Math.random() * regionData.states.length);
    
    // Update location details
    currentLocationDetails = {
        state: regionData.states[randomIndex],
        district: regionData.districts[randomIndex],
        village: regionData.villages[randomIndex],
        region: region,
        coordinates: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        soilType: regionData.soilType,
        soilCode: regionData.soilCode,
        climate: regionData.climate,
        season: regionData.season,
        planting: regionData.planting,
        harvest: regionData.harvest
    };
    
    // Store detected region and soil for form filling
    currentDetectedRegion = regionCode;
    currentDetectedSoil = regionData.soilCode;
    
    // Update UI elements
    stateDisplay.textContent = currentLocationDetails.state;
    districtDisplay.textContent = currentLocationDetails.district;
    villageDisplay.textContent = currentLocationDetails.village;
    regionDisplay.textContent = currentLocationDetails.region;
    coordinatesDisplay.textContent = currentLocationDetails.coordinates;
    soilTypeDisplay.textContent = currentLocationDetails.soilType;
    
    // Update address lines
    addressLine1.textContent = `${currentLocationDetails.village}, ${currentLocationDetails.district}`;
    addressLine2.textContent = `${currentLocationDetails.state}, ${currentLocationDetails.region}`;
    addressLine3.textContent = `Soil: ${currentLocationDetails.soilType}, Climate: ${currentLocationDetails.climate}`;
    
    // Show auto-fill notice
    locationAutoFillNotice.classList.add('show');
}

// Update weather and dashboard
function updateWeatherDashboard() {
    if (!currentDetectedRegion) return;
    
    // Update soil analysis
    soilTypeDash.textContent = currentLocationDetails.soilType;
    
    // Set soil pH based on soil type
    let soilPHValue, nutrientValue, moistureValue;
    switch(currentDetectedSoil) {
        case "alluvial":
            soilPHValue = "6.5 - 7.5 (Optimal)";
            nutrientValue = "High";
            moistureValue = "70%";
            break;
        case "black":
            soilPHValue = "7.5 - 8.5 (Alkaline)";
            nutrientValue = "Very High";
            moistureValue = "75%";
            break;
        case "red":
            soilPHValue = "5.5 - 6.5 (Acidic)";
            nutrientValue = "Medium";
            moistureValue = "50%";
            break;
        default:
            soilPHValue = "6.8 (Optimal)";
            nutrientValue = "Medium";
            moistureValue = "65%";
    }
    
    soilPH.textContent = soilPHValue;
    nutrientLevel.textContent = nutrientValue;
    moistureContent.textContent = moistureValue;
    
    // Update farming calendar
    currentSeason.textContent = currentLocationDetails.season;
    plantingWindow.textContent = currentLocationDetails.planting;
    harvestPeriod.textContent = currentLocationDetails.harvest;
    
    // Set rainfall probability based on region
    let rainfallProbability;
    switch(currentDetectedRegion) {
        case "east": rainfallProbability = "90%"; break;
        case "south": rainfallProbability = "75%"; break;
        case "north": rainfallProbability = "60%"; break;
        case "west": rainfallProbability = "40%"; break;
        case "central": rainfallProbability = "55%"; break;
        default: rainfallProbability = "65%";
    }
    rainfallProb.textContent = rainfallProbability;
    
    // Update weather
    const weather = weatherData[currentDetectedRegion] || weatherData.north;
    weatherIcon.className = `fas ${weather.icon}`;
    currentTemp.textContent = weather.temp;
    weatherCondition.textContent = weather.condition;
    weatherLocation.textContent = `${currentLocationDetails.village}, ${currentLocationDetails.district}`;
    
    // Update weather forecast
    weatherForecast.innerHTML = '';
    weather.forecast.forEach(day => {
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <div class="day">${day.day}</div>
            <div class="temp">${day.temp}</div>
            <div><i class="fas ${day.icon}"></i></div>
        `;
        weatherForecast.appendChild(forecastDay);
    });
}

// Get region code from region name
function getRegionCode(regionName) {
    const regionLower = regionName.toLowerCase();
    if (regionLower.includes("north")) return "north";
    if (regionLower.includes("south")) return "south";
    if (regionLower.includes("east")) return "east";
    if (regionLower.includes("west")) return "west";
    if (regionLower.includes("central")) return "central";
    return "north"; // default
}

// Fill form with current location data
function fillFormFromCurrentLocation() {
    if (!currentDetectedRegion || !currentDetectedSoil) return;
    
    // Set location dropdown to "Use My Current Location"
    locationSelect.value = "current-location";
    
    // Set soil type based on detected soil
    soilTypeSelect.value = currentDetectedSoil;
    
    // Show auto-fill notices
    locationNotice.classList.add('show');
    soilNotice.classList.add('show');
    
    // Scroll to form section
    setTimeout(() => {
        document.getElementById('cropAdvisory').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Hide auto-fill notices
function hideAutoFillNotices() {
    locationNotice.classList.remove('show');
    soilNotice.classList.remove('show');
}

// Calculate profit function
function calculateProfit(e) {
    e.preventDefault();
    
    const landArea = parseFloat(document.getElementById('landAreaCalc').value);
    const expectedYield = parseFloat(document.getElementById('expectedYield').value);
    const marketPrice = parseFloat(document.getElementById('marketPrice').value);
    const costPerAcre = parseFloat(document.getElementById('costPerAcre').value);
    
    // Calculations
    const totalProduction = landArea * expectedYield;
    const totalRevenue = totalProduction * marketPrice;
    const totalCost = landArea * costPerAcre;
    const netProfit = totalRevenue - totalCost;
    const profitPerAcre = netProfit / landArea;
    const roiPercentage = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : 0;
    
    // Update results
    document.getElementById('totalProduction').textContent = `${totalProduction.toLocaleString()} kg`;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('totalCost').textContent = `₹${totalCost.toLocaleString()}`;
    document.getElementById('netProfit').textContent = `₹${netProfit.toLocaleString()}`;
    document.getElementById('profitPerAcre').textContent = `₹${profitPerAcre.toLocaleString()}`;
    document.getElementById('roiPercentage').textContent = `${roiPercentage}%`;
    
    // Show result
    document.getElementById('profitResult').classList.add('show');
}

// Estimate yield function
function estimateYield(e) {
    e.preventDefault();
    
    const cropType = document.getElementById('cropTypeYield').value;
    const seedQuality = document.getElementById('seedQuality').value;
    const irrigationType = document.getElementById('irrigationType').value;
    const fertilizerUse = document.getElementById('fertilizerUse').value;
    
    // Base yields for different crops (kg/acre)
    const baseYields = {
        "wheat": 2500,
        "rice": 3000,
        "cotton": 800,
        "sugarcane": 50000
    };
    
    let baseYield = baseYields[cropType] || 2000;
    
    // Adjust based on factors
    let multiplier = 1.0;
    if (seedQuality === "high") multiplier *= 1.2;
    if (seedQuality === "low") multiplier *= 0.8;
    
    if (irrigationType === "full") multiplier *= 1.3;
    if (irrigationType === "rainfed") multiplier *= 0.7;
    
    if (fertilizerUse === "high") multiplier *= 1.25;
    if (fertilizerUse === "low") multiplier *= 0.75;
    
    const estimatedYield = Math.round(baseYield * multiplier);
    
    // Determine yield potential
    let yieldPotential = "Medium";
    if (multiplier > 1.2) yieldPotential = "High";
    if (multiplier < 0.8) yieldPotential = "Low";
    
    // Recommendations
    let recommendations = "Maintain current practices.";
    if (seedQuality === "low") recommendations = "Use certified high-quality seeds.";
    if (irrigationType === "rainfed") recommendations = "Consider supplementary irrigation.";
    if (fertilizerUse === "low") recommendations = "Increase fertilizer application as per soil test.";
    
    // Update results
    document.getElementById('estimatedYield').textContent = `${estimatedYield.toLocaleString()} kg/acre`;
    document.getElementById('yieldPotential').textContent = yieldPotential;
    document.getElementById('yieldRecommendations').textContent = recommendations;
    
    // Show result
    document.getElementById('yieldResult').classList.add('show');
}

// Calculate water needs function
function calculateWater(e) {
    e.preventDefault();
    
    const cropType = document.getElementById('cropWater').value;
    const landArea = parseFloat(document.getElementById('waterLandArea').value);
    const growthStage = document.getElementById('growthStage').value;
    const soilMoisture = parseFloat(document.getElementById('soilMoisture').value);
    
    // Base water requirements (liters/day/acre)
    const baseWater = {
        "rice": 25000,
        "wheat": 15000,
        "cotton": 18000,
        "pulses": 8000,
        "vegetables": 20000
    };
    
    let dailyBase = baseWater[cropType] || 12000;
    
    // Adjust based on growth stage
    let stageMultiplier = 1.0;
    switch(growthStage) {
        case "initial": stageMultiplier = 0.7; break;
        case "development": stageMultiplier = 1.1; break;
        case "mid": stageMultiplier = 1.3; break;
        case "late": stageMultiplier = 0.9; break;
    }
    
    // Adjust based on soil moisture
    let moistureMultiplier = 1.0;
    if (soilMoisture > 80) moistureMultiplier = 0.5;
    else if (soilMoisture > 60) moistureMultiplier = 0.7;
    else if (soilMoisture < 40) moistureMultiplier = 1.3;
    else if (soilMoisture < 20) moistureMultiplier = 1.5;
    
    const dailyWater = Math.round(dailyBase * stageMultiplier * moistureMultiplier * landArea);
    const weeklyWater = dailyWater * 7;
    const seasonalWater = dailyWater * 120; // Approx 120 day season
    
    // Irrigation frequency
    let irrigationFreq = "Every 3 days";
    if (cropType === "rice") irrigationFreq = "Daily";
    if (cropType === "pulses") irrigationFreq = "Every 5-7 days";
    
    // Water saving tips
    let waterTips = "Use drip irrigation for efficiency.";
    if (soilMoisture < 40) waterTips = "Increase irrigation frequency immediately.";
    if (cropType === "rice") waterTips = "Consider System of Rice Intensification (SRI) to save water.";
    
    // Update results
    document.getElementById('dailyWater').textContent = `${dailyWater.toLocaleString()} liters`;
    document.getElementById('weeklyWater').textContent = `${weeklyWater.toLocaleString()} liters`;
    document.getElementById('seasonalWater').textContent = `${seasonalWater.toLocaleString()} liters`;
    document.getElementById('irrigationFreq').textContent = irrigationFreq;
    document.getElementById('waterTips').textContent = waterTips;
    
    // Show result
    document.getElementById('waterResult').classList.add('show');
}

// Calculate fertilizer needs function
function calculateFertilizer(e) {
    e.preventDefault();
    
    const cropType = document.getElementById('cropFertilizer').value;
    const landArea = parseFloat(document.getElementById('fertLandArea').value);
    const soilTest = document.getElementById('soilTest').value;
    const previousCrop = document.getElementById('previousCrop').value;
    
    // Base fertilizer requirements (kg/acre)
    const baseFertilizer = {
        "wheat": {N: 120, P: 60, K: 40},
        "rice": {N: 150, P: 70, K: 60},
        "cotton": {N: 100, P: 50, K: 50},
        "maize": {N: 140, P: 65, K: 55},
        "vegetables": {N: 80, P: 40, K: 60}
    };
    
    let base = baseFertilizer[cropType] || {N: 100, P: 50, K: 40};
    
    // Adjust based on soil test
    let soilMultiplier = 1.0;
    if (soilTest === "low") soilMultiplier = 1.3;
    if (soilTest === "high") soilMultiplier = 0.7;
    
    // Adjust based on previous crop
    if (previousCrop === "legume") soilMultiplier *= 0.9; // Less N needed after legumes
    if (previousCrop === "fallow") soilMultiplier *= 1.1; // More needed after fallow
    
    const nitrogen = Math.round(base.N * soilMultiplier * landArea);
    const phosphorus = Math.round(base.P * soilMultiplier * landArea);
    const potassium = Math.round(base.K * soilMultiplier * landArea);
    const totalFertilizer = nitrogen + phosphorus + potassium;
    
    // Application timing
    let fertTiming = "Split application: 50% basal, 25% at tillering, 25% at flowering";
    if (cropType === "vegetables") fertTiming = "Weekly foliar application recommended";
    if (cropType === "cotton") fertTiming = "Basal + 2 top dressings at square formation and boll development";
    
    // Estimated cost (₹/kg: N-30, P-25, K-20)
    const fertCost = (nitrogen * 30) + (phosphorus * 25) + (potassium * 20);
    
    // Update results
    document.getElementById('nitrogenAmount').textContent = `${nitrogen} kg`;
    document.getElementById('phosphorusAmount').textContent = `${phosphorus} kg`;
    document.getElementById('potassiumAmount').textContent = `${potassium} kg`;
    document.getElementById('totalFertilizer').textContent = `${totalFertilizer} kg`;
    document.getElementById('fertTiming').textContent = fertTiming;
    document.getElementById('fertCost').textContent = `₹${fertCost.toLocaleString()}`;
    
    // Show result
    document.getElementById('fertilizerResult').classList.add('show');
}

// Function to generate crop recommendations based on inputs
function generateRecommendations(location, lastCrop, soilType, budget, riskTolerance, cropPreference, landArea) {
    // Crop database with properties
    const cropDatabase = {
        wheat: {
            name: "Wheat",
            suitableRegions: ["north", "central"],
            suitableSoil: ["alluvial", "black"],
            budgetLevel: "medium",
            riskLevel: "low",
            cropType: "cereals",
            profitProbability: 85,
            avgInvestment: 30000,
            avgProfit: 45000,
            season: "Rabi (Winter)",
            waterReq: "Medium",
            growthPeriod: "120-140 days"
        },
        rice: {
            name: "Rice",
            suitableRegions: ["north", "south", "east"],
            suitableSoil: ["alluvial", "black"],
            budgetLevel: "medium",
            riskLevel: "medium",
            cropType: "cereals",
            profitProbability: 80,
            avgInvestment: 35000,
            avgProfit: 55000,
            season: "Kharif (Monsoon)",
            waterReq: "High",
            growthPeriod: "150-180 days"
        },
        cotton: {
            name: "Cotton",
            suitableRegions: ["west", "south"],
            suitableSoil: ["black", "red"],
            budgetLevel: "high",
            riskLevel: "high",
            cropType: "cash",
            profitProbability: 65,
            avgInvestment: 60000,
            avgProfit: 90000,
            season: "Kharif (Monsoon)",
            waterReq: "Medium",
            growthPeriod: "160-180 days"
        },
        sugarcane: {
            name: "Sugarcane",
            suitableRegions: ["north", "south"],
            suitableSoil: ["alluvial", "black"],
            budgetLevel: "very-high",
            riskLevel: "medium",
            cropType: "cash",
            profitProbability: 75,
            avgInvestment: 90000,
            avgProfit: 140000,
            season: "Year-round",
            waterReq: "High",
            growthPeriod: "12-18 months"
        },
        maize: {
            name: "Maize",
            suitableRegions: ["north", "west", "central"],
            suitableSoil: ["alluvial", "red"],
            budgetLevel: "medium",
            riskLevel: "medium",
            cropType: "cereals",
            profitProbability: 70,
            avgInvestment: 25000,
            avgProfit: 40000,
            season: "Kharif (Monsoon)",
            waterReq: "Medium",
            growthPeriod: "90-100 days"
        },
        pulses: {
            name: "Pulses (Lentils/Chickpeas)",
            suitableRegions: ["central", "north"],
            suitableSoil: ["alluvial", "red", "laterite"],
            budgetLevel: "low",
            riskLevel: "low",
            cropType: "pulses",
            profitProbability: 90,
            avgInvestment: 15000,
            avgProfit: 25000,
            season: "Rabi (Winter)",
            waterReq: "Low",
            growthPeriod: "90-120 days"
        },
        vegetables: {
            name: "Vegetables (Tomato/Onion)",
            suitableRegions: ["north", "south", "east", "west", "central"],
            suitableSoil: ["alluvial", "red", "black"],
            budgetLevel: "medium",
            riskLevel: "high",
            cropType: "horticulture",
            profitProbability: 60,
            avgInvestment: 40000,
            avgProfit: 70000,
            season: "Year-round (depending on type)",
            waterReq: "Medium-High",
            growthPeriod: "60-90 days"
        },
        fruits: {
            name: "Fruits (Mango/Citrus)",
            suitableRegions: ["south", "west", "central"],
            suitableSoil: ["red", "laterite", "alluvial"],
            budgetLevel: "high",
            riskLevel: "high",
            cropType: "horticulture",
            profitProbability: 55,
            avgInvestment: 80000,
            avgProfit: 150000,
            season: "Perennial",
            waterReq: "Medium",
            growthPeriod: "3-5 years (for yield)"
        },
        soybean: {
            name: "Soybean",
            suitableRegions: ["central", "west"],
            suitableSoil: ["black", "red"],
            budgetLevel: "medium",
            riskLevel: "medium",
            cropType: "pulses",
            profitProbability: 75,
            avgInvestment: 28000,
            avgProfit: 42000,
            season: "Kharif (Monsoon)",
            waterReq: "Medium",
            growthPeriod: "100-120 days"
        },
        groundnut: {
            name: "Groundnut",
            suitableRegions: ["south", "west"],
            suitableSoil: ["red", "laterite", "alluvial"],
            budgetLevel: "low",
            riskLevel: "low",
            cropType: "cash",
            profitProbability: 85,
            avgInvestment: 20000,
            avgProfit: 35000,
            season: "Kharif (Monsoon)",
            waterReq: "Low",
            growthPeriod: "100-130 days"
        }
    };
    
    // Filter crops based on user inputs
    let filteredCrops = [];
    
    for (const cropKey in cropDatabase) {
        const crop = cropDatabase[cropKey];
        
        // Check if crop is suitable for the selected region
        if (!crop.suitableRegions.includes(location)) continue;
        
        // Check if crop is suitable for soil type
        if (!crop.suitableSoil.includes(soilType)) continue;
        
        // Check if crop matches budget level
        if (budget !== crop.budgetLevel) {
            const budgetOrder = ["low", "medium", "high", "very-high"];
            const userBudgetIndex = budgetOrder.indexOf(budget);
            const cropBudgetIndex = budgetOrder.indexOf(crop.budgetLevel);
            
            // If crop budget is significantly higher than user budget, skip
            if (cropBudgetIndex > userBudgetIndex + 1) continue;
        }
        
        // Check if crop matches risk tolerance
        if (riskTolerance === "low" && crop.riskLevel === "high") continue;
        if (riskTolerance === "medium" && crop.riskLevel === "high") {
            crop.profitProbability = Math.max(crop.profitProbability - 15, 30);
        }
        
        // Check crop preference if specified
        if (cropPreference && crop.cropType !== cropPreference) continue;
        
        // Crop rotation check
        if (lastCrop === cropKey || (lastCrop === "wheat" && cropKey === "wheat")) {
            crop.profitProbability = Math.max(crop.profitProbability - 10, 40);
        }
        
        // Add to filtered list
        filteredCrops.push(crop);
    }
    
    // Sort by profit probability (descending)
    filteredCrops.sort((a, b) => b.profitProbability - a.profitProbability);
    
    // Return top 3 recommendations
    return filteredCrops.slice(0, 3);
}

// Function to display results
function displayResults(recommendations) {
    resultsSection.style.display = 'block';
    resultsContent.innerHTML = '';
    
    if (recommendations.length === 0) {
        resultsContent.innerHTML = `
            <div class="crop-card">
                <h3>No Suitable Crops Found</h3>
                <p>Based on your inputs, we couldn't find crops that match all your criteria. Try adjusting your preferences (like budget or risk tolerance) for better results.</p>
            </div>
        `;
        return;
    }
    
    recommendations.forEach((crop, index) => {
        let riskClass = '';
        if (crop.riskLevel === 'low') riskClass = 'risk-low-bg';
        else if (crop.riskLevel === 'medium') riskClass = 'risk-medium-bg';
        else if (crop.riskLevel === 'high') riskClass = 'risk-high-bg';
        
        let probColor = '';
        if (crop.profitProbability >= 80) probColor = 'var(--success)';
        else if (crop.profitProbability >= 60) probColor = 'var(--warning)';
        else probColor = 'var(--danger)';
        
        const cropCard = document.createElement('div');
        cropCard.className = `crop-card ${riskClass}`;
        cropCard.innerHTML = `
            <div class="crop-header">
                <div class="crop-name">${index + 1}. ${crop.name}</div>
                <div class="profit-probability" style="background-color: ${probColor}">
                    ${crop.profitProbability}% Profit Probability
                </div>
            </div>
            
            <div class="crop-details">
                <div class="detail-item">
                    <span class="detail-label">Risk Level</span>
                    <span class="detail-value" style="color: ${crop.riskLevel === 'low' ? 'var(--success)' : crop.riskLevel === 'medium' ? 'var(--warning)' : 'var(--danger)'}">
                        ${crop.riskLevel.charAt(0).toUpperCase() + crop.riskLevel.slice(1)}
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Avg. Investment (per acre)</span>
                    <span class="detail-value">₹${crop.avgInvestment.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Avg. Profit (per acre)</span>
                    <span class="detail-value">₹${crop.avgProfit.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Growth Period</span>
                    <span class="detail-value">${crop.growthPeriod}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Water Requirement</span>
                    <span class="detail-value">${crop.waterReq}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Best Season</span>
                    <span class="detail-value">${crop.season}</span>
                </div>
            </div>
            
            <div class="suggestion">
                <div class="suggestion-title">Our Suggestion:</div>
                <p>${generateSuggestion(crop)}</p>
            </div>
        `;
        
        resultsContent.appendChild(cropCard);
    });
    
    const summaryCard = document.createElement('div');
    summaryCard.className = 'crop-card';
    summaryCard.innerHTML = `
        <h3>Summary</h3>
        <p>Based on your inputs, we recommend <strong>${recommendations[0].name}</strong> as your primary crop choice with ${recommendations[0].profitProbability}% profit probability.</p>
        <p>Remember to consider local weather conditions, market prices, and consult with agricultural experts before finalizing your crop selection.</p>
    `;
    resultsContent.appendChild(summaryCard);
}

// Function to generate crop-specific suggestions
function generateSuggestion(crop) {
    const suggestions = {
        wheat: "Wheat is a stable choice with consistent market demand. Ensure proper irrigation during growth stages and consider government procurement options.",
        rice: "Rice requires good water management. Consider System of Rice Intensification (SRI) techniques for higher yield with less water.",
        cotton: "Cotton has high profit potential but is susceptible to pest attacks. Implement integrated pest management practices.",
        sugarcane: "Sugarcane is a long-term crop with good returns. Consider contract farming with sugar mills for assured market.",
        maize: "Maize has multiple uses (food, feed, industrial). Consider hybrid varieties for higher yield.",
        pulses: "Pulses improve soil fertility through nitrogen fixation. They have good government support and stable prices.",
        vegetables: "Vegetables offer quick returns but require careful market timing. Consider greenhouse cultivation for off-season produce.",
        fruits: "Fruit cultivation is long-term but highly profitable once established. Consider intercropping with short-term crops initially.",
        soybean: "Soybean is a good rotation crop that improves soil health. Has growing demand in food processing industry.",
        groundnut: "Groundnut is drought-resistant and suitable for rainfed areas. Good for oil extraction and direct consumption markets."
    };
    
    return suggestions[crop.name.toLowerCase().split(' ')[0]] || "This crop is suitable for your conditions. Consult local agricultural officers for specific cultivation practices.";
}
