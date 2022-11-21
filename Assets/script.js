var key = "b8b048d16287e684d3d1effce4278494";
var historyArr = [];

$(".searchbox").on("click", function (e) {
  e.preventDefault();
  var city = $(this).siblings(".input-search").val();
  historyArr.push(city);
  localStorage.setItem("weather-history", JSON.stringify(historyArr));
  showButtons();
  getWeather(city);
});

var cityContainer = $(".city-container");

function showButtons() {
  cityContainer.empty();
  for (let i = 0; i < historyArr.length; i++) {
    var btnEl = $("<button>").text(`${historyArr[i]}`);

    btnEl.attr("type", "button");
    btnEl.attr("class", "cityBtn");

    cityContainer.append(btnEl);
  }

  //Allows the buttons to start a search as well
  $(".cityBtn").on("click", function (event) {
    event.preventDefault();
    city = $(this).text();

    getWeather(city);
  });
}

function getWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var tempEl = $(".temperature");
      var windEl = $(".wind");
      var humidityEl = $(".humidity");
      $("<h2>").text("current Day  weather");
      $(".weather-image").attr(
        "src",
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      );
      tempEl.text(`Temp: ${data.main.temp} F`);
      windEl.text(`Wind:${data.wind.speed} MPH`);
      humidityEl.text(`Humidity: ${data.main.humidity} %`);

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      getFiveDayForecast(lat, lon);
    });
}

function getFiveDayForecast(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var fiveDayList = data.list;
      var weatherDays = [];

      $.each(fiveDayList, function (index, value) {
        //using the .each to go through the list
        weatherObj = {
          date: value.dt_txt.split(" ")[0],
          time: value.dt_txt.split(" ")[1],
          temp: value.main.temp,
          icon: value.weather[0].icon,
          wind: value.wind.speed,
          humidity: value.main.humidity,
        };

        if (value.dt_txt.split(" ")[1] === "12:00:00") {
          // if 12pm is true then it will add it to the weatherdays
          weatherDays.push(weatherObj);
        }
      });
      var fiveDaysContainer = $(".five-day");
      fiveDaysContainer.empty();

      for (let i = 0; i < weatherDays.length; i++) {
        console.log(weatherDays[i]);
        var divEl = $("<div>");
        fiveDaysContainer.append(divEl);

        //date
        var dateEl = $("<h2>");
        var m = moment(weatherDays[i].date).format("MM/DD/YYYY");
        dateEl.append(m);
        divEl.append(dateEl);

        //icon
        var imageEl = $("<img>");
        imageEl.attr(
          "src",
          `https://openweathermap.org/img/wn/${weatherDays[i].icon}@2x.png`
        );
        divEl.append(imageEl);

        //temp
        var tempEl = $("<p>");
        tempEl.text(`Temp: ${weatherDays[i].temp} F`);
        divEl.append(tempEl);

        //wind
        var windEl = $("<p>");
        windEl.text(`Wind:${weatherDays[i].wind} MPH`);
        divEl.append(windEl);

        var humidityEl = $("<p>");
        humidityEl.text(`Humidity: ${weatherDays[i].humidity} %`);
        divEl.append(humidityEl);
      }
    });
}

var cityHistory = JSON.parse(localStorage.getItem("weather-history"));

if (cityHistory !== null) {
  historyArr = cityHistory;
}
showButtons();
