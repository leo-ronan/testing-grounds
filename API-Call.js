$(document).ready(function () {
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
        //Get desired filters
        filters = {
            disasters: {
                include: $("#disasters").val(),
                exclude: $("#eDisasters").val()
            },
            location: {
                county: null,
                state: $("#stateInput").val()
            },
            startDate: $("#startDateInput").val(),
            endDate: null 
        }
        console.log(filters);
        //TEST
        var disasterInc, disasterExc, disasterFilter;
        if (filters.disasters.include == null && filters.disasters.exclude == null) {
            //All
            disasterFilter = "";
            console.log(disasterFilter);
        }
        else if (filters.disasters.include !== null && filters.disasters.exclude !== null) {
            //Include and exclude
            disasterInc = filters.disasters.include;
            disasterExc = filters.disasters.exclude;
            disasterFilter = "incidentType%20eq%20%27" + disasterInc + "%27%20and%20incidentType%20ne%20%27" + disasterExc + "%27";
            console.log(disasterFilter);
        }
        else if (filters.disasters.include !== null && filters.disasters.exclude == null) {
            //Only include
            disasterInc = filters.disasters.include;
            disasterFilter = "incidentType%20eq%20%27" + disasterInc + "%27";
            console.log(disasterFilter);
        }
        else if (filters.disasters.include == null && filters.disasters.exclude !== null) {
            //Only exclude
            disasterExc = filters.disasters.exclude;
            disasterFilter = "incidentType%20ne%20%27" + disasterExc + "%27";
            console.log(disasterFilter);
        }
        
    });
    
    function femaCall(filters) {
    
        //Set up variables for storing response data
        var date;
        var disasterStart, disasterEnd, disasterType, disasterCounty, disasterStatus;
        var disasterInc, disasterExc, state, county, start, end;
        var disasterFilter, locationFilter, dateFilter;
        
        if (filters !== null) {
        //DISASTERS
        if (filters.disasters.include == null && filters.disasters.exclude == null) {
            //All
            disasterInc = "";
        }
        else if (filters.disasters.include !== null && filters.disasters.exclude !== null) {
            //Include and exclude
            disasterInc = filters.disasters.include;
            disasterExc = filters.disasters.exclude;
            disasterFilter = "incidentType%20eq%20%27" + disasterInc + "%27%20and%20incidentType%20ne%20%27" + disasterExc + "%27";
        }
        else if (filters.disasters.include !== null && filters.disasters.exclude == null) {
            //Only include
            disasterInc = filters.disasters.include;
            disasterFilter = "incidentType%20eq%20%27" + disasterInc + "%27";
        }
        else if (filters.disasters.include == null && filters.disasters.exclude !== null) {
            //Only exclude
            disasterExc = filters.disasters.exclude;
            disasterFilter = "incidentType%20ne%20%27" + disasterExc + "%27";
        }
        
        //LOCATION
        if (filters.location.county == null && filters.location.state == null) {
            //All disasters
            
        }
        else if (filters.location.county !== null && filters.location.state !== null) {
            //Include and exclude
            
        }
        else if (filters.location.county !== null && filters.location.state == null) {
            //Only include
            
        }
        else if (filters.location.county == null && filters.location.state !== null) {
            //Only exclude
            
        }

        //DATE
        if (filters.date.startDate == null && filters.date.endDate == null) {
            //All disasters
            
        }
        else if (filters.date.startDate !== null && filters.date.endDate !== null) {
            //Include and exclude
            
        }
        else if (filters.date.startDate !== null && filters.date.endDate == null) {
            //Only include
            
        }
        else if (filters.date.startDate == null && filters.date.endDate !== null) {
            //Only exclude
            
        }
        }

        //$filter=declarationDate%20{gt, lt, eq}%27{date in ISO-8601 format}%27%20{and, or}%20state%20{eq, ne}%20%27{state abbr. (caps)}%27
          //gt = greater than, lt = less than, eq = equal to, ne = not equal to (exclude)
        var linkStart = "https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=";
        var queryURL = linkStart + locationFilter + "%20" + dateFilter + "%20" + disasterFilter;
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
                var lastDec = (res.length) - 1;1
    
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
                //History saved case
                if (saveHistory == true) {
                    $("#data").append("<li>-----</li>");
                }
            });
    }    
});
