$(document).ready(function () {
    //Store selected disaster types in storage spans (inc/excStorage) FIX THIS
    var incListArr = {
        status: "empty",
        types: []
    };
    $(".incList").on("click", event => {
        console.log(event.target.value);
        var isDuplicate = false;
        if (incListArr.status !== "empty") {
            for (let i = 0; i < incListArr.length; i++) {
                if (event.target.value == incListArr[i]) {
                    isDuplicate = true;
                }
            }
        }
        if (isDuplicate == false) {
            var newInc = document.createElement("p");
            newInc.innerHTML = event.target.value + ",";
            document.getElementById("incStorage").appendChild(newInc);
            newInc.style.display = "inline-block";
            incListArr.types.push(event.target.value);
            incListArr.status = "in use";
        }
    });

    var excListArr = {
        status: "empty",
        types: []
    };
    $(".excList").on("click", event => {
        console.log(event.target.value);
        var isDuplicate = false;
        if (excListArr.status !== "empty") {
            for (let i = 0; i < excListArr.length; i++) {
                if (event.target.value == excListArr[i]) {
                    isDuplicate = true;
                }
            }
        }
        if (isDuplicate == false) {
            var newExc = document.createElement("p");
            newExc.innerHTML = event.target.value + ",";
            document.getElementById("excStorage").appendChild(newExc);
            newExc.style.display = "inline-block";
            excListArr.types.push(event.target.value);
            excListArr.status = "in use"
        }
    });

    var filters = {
        disasters: {
            include: "",
            exclude: ""
        },
        location: {
            county: "",
            state: ""
        },
        date: {
            startDate: "",
            endDate: ""
        }
    }
    
    $("#submit").on("click", function() {
        //Get desired filters MUST CHANGE DISASTERS INCLUDE TO NOW UTILIZE inc/excListArr.
        filters = {
            disasters: {
                include: $("#disasters").val(),
                exclude: $("#eDisasters").val()
            },
            location: {
                county: null,
                state: $("#stateInput").val()
            },
            date: {
                startDate: $("#startDateInput").val(),
                endDate: $("#endDateInput").val()
            }
        }
        console.log(filters);
        console.log($("#endDateInput").val());
        femaCall(filters);
    });
    
    function femaCall(filters) {
        //Set up variables for storing response data
        var disasterStart, disasterEnd, disasterType, disasterCounty, disasterStatus;
        var locationState, locationCounty, locationFilter
        var disasterInc, disasterExc, disasterFilter;
        var date1, date2, dateFilter;
        
        if (filters !== null) {
        //DISASTERS
        if (filters.disasters.include == "" && filters.disasters.exclude == "") {
            //All
            disasterFilter = "";
        }
        else if (filters.disasters.include !== "" && filters.disasters.exclude !== "") {
            //Include and exclude
            disasterInc = filters.disasters.include;
            disasterExc = filters.disasters.exclude;
            disasterFilter = "incidentType%20eq%20%27" + disasterInc + "%27%20and%20incidentType%20ne%20%27" + disasterExc + "%27";
        }
        else if (filters.disasters.include !== "" && filters.disasters.exclude == "") {
            //Only include
            disasterInc = filters.disasters.include;
            disasterFilter = "incidentType%20eq%20%27" + disasterInc + "%27";
        }
        else if (filters.disasters.include == "" && filters.disasters.exclude !== "") {
            //Only exclude
            disasterExc = filters.disasters.exclude;
            disasterFilter = "incidentType%20ne%20%27" + disasterExc + "%27";
        }
        
        //LOCATION
        if (filters.location.county == null && filters.location.state == null) {
            //No location filter
            locationFilter = "";
        }
        else if (filters.location.county !== null && filters.location.state !== null) {
            //Filter by state and county
            locationState = filters.location.state;
            locationCounty = filters.location.county;
            locationFilter = "state%20eq%20%27" + locationState + "%27%20and%20declaredCountyArea%20eq&20&27" + locationCounty + "%27";
        }
        else if (filters.location.county !== null && filters.location.state == null) {
            //Filter by county only
            locationCounty = filters.location.county;
            locationFilter = "declaredCountyArea%20eq%20%27" + locationCounty + "%27";
        }
        else if (filters.location.county == null && filters.location.state !== null) {
            //Filter by state only
            locationState = filters.location.state;
            locationFilter = "state%20eq%20%27" + locationState + "%27";
        }

        //DATE
        if (filters.date.startDate == null && filters.date.endDate == null) {
            //No date filter
            dateFilter = "";
        }
        else if (filters.date.startDate !== null && filters.date.endDate !== null) {
            //Start and end date filter
            date1 = filters.date.startDate;
            date2 = filters.date.endDate;
            dateFilter = "declarationDate%20ge%20%27" + date1 + "%27%20and%20declarationDate%20le%20%27" + date2 + "%27";
        }
        else if (filters.date.startDate !== null && filters.date.endDate == null) {
            //Filter by start date only
            date1 = filters.date.startDate;
            dateFilter = "declarationDate%20ge%20%27" + date1;
        }
        else if (filters.date.startDate == null && filters.date.endDate !== null) {
            //Filter by end date only
            date2 = filters.date.endDate;
            dateFilter = "declarationDate%20le%20%27" + date2;
        }
        }
        //Ensure link is spaced properly depending on which data is being filtered
        if (dateFilter != "" && locationFilter != "") {
            dateFilter = "%20and%20" + dateFilter;
        }
        if ((disasterFilter != "" && dateFilter != "") || (disasterFilter != "" && dateFilter == "" && locationFilter != "")) {
            disasterFilter = "%20and%20" + disasterFilter;
        }
        //$filter=declarationDate%20{gt, lt, eq}%27{date in ISO-8601 format}%27%20{and, or}%20state%20{eq, ne}%20%27{state abbr. (caps)}%27
          //gt = greater than, lt = less than, eq = equal to, ne = not equal to (exclude)
        var linkStart = "https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=";
        var queryURL = linkStart + locationFilter + dateFilter + disasterFilter;
        console.log(queryURL);
        $.ajax({
            datatype: "json",
            url: queryURL,
            method: "GET"
        })
            .then(function(response) {
                console.log(response);
                //Shortcut for readability
                var res = response.DisasterDeclarationsSummaries
    
                //Read last item in array
                if (res.length == 0) {
                    alert("No data!");
                }
                else {
                    var lastDec = (res.length) - 1;
    
                    //Store info in previously created variables
                    disasterCounty = res[lastDec].declaredCountyArea;
                    disasterType = res[lastDec].incidentType;
                    disasterStart = res[lastDec].incidentBeginDate;
                    disasterEnd = res[lastDec].incidentEndDate;
                    //If there is no end date, set disasterStatus to true (active)
                    if (disasterEnd != null) {
                        disasterStatus = false;
                    }
                    else {
                        disasterStatus = true;
                    }
        
                    //Display info
                    $("#data").append("<li id='county'>County: " + disasterCounty + "</li>");
                    $("#data").append("<li id='type'>Type: " + disasterType + "</li>");
                    $("#data").append("<li id='start'>Start: " + disasterStart + "</li>");
                    if (disasterStatus == false){
                        $("#data").append("<li id='end'>End: " + disasterEnd + "</li>");
                    }
                    else {
                        $("#data").append("<li id='status'>Still active!</li>")
                    }
                }      
            });
    }    
});
