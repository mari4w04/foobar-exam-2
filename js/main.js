"use strict"

window.addEventListener("load", showAllData);

function showAllData(){
    gettingData();
    //Getting data every 10 seconds
    setInterval(gettingData, 10000);
    getBeerData();
};

let data;
let dashboardStorageInfo, dashboardQueueInfo, dashboardServingInfo, dashboardBeerLevel, dashboardBarInfo;
let allOrders = 0; 
let b1Customers = [], b2Customers = [], b3Customers = [], beersServedIds = [], i;

function getBeerData(){
    //Getting data and parsing it
    data = JSON.parse(FooBar.getData());
    //Setting beer info data in the template
    showBeerTypeData(data.beertypes);
};

function gettingData(){
    //Getting data and parsing it
    data = JSON.parse(FooBar.getData()); //mydata
    
    console.log(data);

    //Cleaning up the containers for the data that is being refreshed
    dashboardBeerLevel = document.querySelector(".beer-levels");
    dashboardBeerLevel.innerHTML = "";
    
    dashboardServingInfo = document.querySelector(".serving-info");
    dashboardServingInfo.innerHTML = "";
    
    dashboardStorageInfo = document.querySelector(".storage-info");
    dashboardStorageInfo.innerHTML = "";

    dashboardQueueInfo = document.querySelector(".queue-info");
    dashboardQueueInfo.innerHTML = "";
    
    dashboardBarInfo = document.querySelector(".bar-info");
    dashboardBarInfo.innerHTML = "";
  


    //Setting bar data in the template
    showBarData(data.bar);
    
    //Setting bartender data in the template
    showBartenderData(data.bartenders);
    

    //Setting beer level data in the template
    showBeerData(data.taps);

    //Setting queue data in the template
    showQueueData(data.queue);

    //Setting serving data in the template
    showServingInfo(data.serving);

    //Setting storage data in the template
    showStorageData(data.storage);

};

function showBarData(barData){
    //Cloning the template
    let barInfoTemplate = document.querySelector("#barInfoTemplate").content;
    let barClone = barInfoTemplate.cloneNode(true);
    //Selecting elements in the clone
    let statusBoard = barClone.querySelector(".status-board");
    let barName = barClone.querySelector(".bar-name");
    let closesInDiv = barClone.querySelector(".closes-in");
    
    //Setting the value for the elements in the clone
    barName.textContent = barData.name + " dashboard";

    //Putting the filled in template into the div container in the HTML
    dashboardBarInfo.appendChild(barClone);

    //Getting the current time
    let now     = new Date(); 
    let hour    = now.getHours();
    let minute  = now.getMinutes();

    console.log("Time: "+hour+":"+minute);

    //Converting hours to minutes
    let hoursInMinutes = hour*60;

    //Calculating current time in minutes
    let currentTimeInMinutes = hoursInMinutes+minute;

    //Internal notes, trying to figure out which time is what in minutes
    //22:00 = 1320
    //23:00 = 1380
    //00:00 = 0
    //01:00 = 60
    //02:00 = 120
    //03:00 = 180
    //04:00 = 240
    //05:00 = 300
    //06:00 = 360
    //07:00 = 420
    //08:00 = 480
    //09:00 = 540

    let opensIn;

    //If current time is between 22:00 and 09:00, then display information that the bar is closed
    if((currentTimeInMinutes>=1320 && currentTimeInMinutes<=1380)||(currentTimeInMinutes>=0 && currentTimeInMinutes<=540)){
        statusBoard.innerHTML = "Bar is <span class='bar-closed'>closed</span>";

        if(currentTimeInMinutes>=1320 && currentTimeInMinutes<1380){
            let newCurrentTimeInMinutes=currentTimeInMinutes-1380;
            opensIn = Math.round((540 - newCurrentTimeInMinutes)/60);
            console.log('First IF');
        }
        if(currentTimeInMinutes>=1380 && currentTimeInMinutes<1440){
            let newCurrentTimeInMinutesTwo=currentTimeInMinutes-1500;
            console.log('Else IF'+newCurrentTimeInMinutesTwo);
            opensIn = Math.round((540 - newCurrentTimeInMinutesTwo)/60);
        }
        if(currentTimeInMinutes>=0 && currentTimeInMinutes<=540){
            opensIn = Math.round((540 - currentTimeInMinutes)/60);
            console.log('Else');
        }
        if(opensIn==0){
            let opensInMinutesLeft=(540 - currentTimeInMinutes)%60;
            closesInDiv.textContent = "Opens in "+opensInMinutesLeft+" minutes";
        }else{
            closesInDiv.textContent = "Opens in "+opensIn+" hours";
        }
        
        //Internal notes
        //540 - (-60) 
        //if 1380, then 1380-1500 
        //if 1320, then 1320-1380

        //If current time is from 09:00 until 22:00 then display information that the bar is open:
    }else{
        statusBoard.innerHTML = "Bar is <span class='bar-open'>open</span>";
        let closesIn = Math.round((1320-currentTimeInMinutes)/60);
        if(closesIn==0){
            let minutesLeft=(1320-currentTimeInMinutes)%60;
            closesInDiv.textContent = "Closes in "+minutesLeft+" minutes";
        }else{
            closesInDiv.textContent = "Closes in "+closesIn+" hours";
        }
        
    };
}

function showBeerData(beerData){
    //Sorting out beer levels from the lowest one to the highest one 
    beerData.sort(function (a, b) {
        return a.level - b.level;
    });
    beerData.forEach(function(tap){
        //Cloning the template
        let beerLevelTemplate = document.querySelector("#beerLevelTemplate").content;
        let beerLevelClone = beerLevelTemplate.cloneNode(true);
        //Selecting elements in the clone
        let beerName = beerLevelClone.querySelector(".beer-left h2");
        let beerLevel = beerLevelClone.querySelector(".beer-level");
        let beerLevelOutline = beerLevelClone.querySelector(".beer-level-outline");
        
        //Setting the value for the elements in the clone
        beerName.textContent = tap.beer;

        //Making the tap level value 15 times smaller to set the height of a div:
        let newTapLevel = tap.level/15;
        beerLevel.style.height = newTapLevel+"px";
        //Adding a percentage value to the tap level
        beerLevel.textContent = Math.round((tap.level/2500*100))+"%";
        //Coloring in tap levels according to how full the tap is. Green - full, yellow - halfway full, red - almost empty
        if(tap.level>=2000){
            beerLevel.style.backgroundColor="#00e276";
            beerLevelOutline.style.border="2px solid #00e276";
            beerName.style.color="#00e276";
        }
        if(tap.level>=800&&tap.level<2000){
            beerLevel.style.backgroundColor="#ffb32c";
            beerLevelOutline.style.border="2px solid #ffb32c";
            beerName.style.color="#ffb32c";
        }
        if(tap.level<800){
            beerLevel.style.backgroundColor="#ff4c2e";
            beerLevelOutline.style.border="2px solid #ff4c2e";
            beerName.style.color="#ff4c2e";
        }
        if(tap.level<20){
            let newTapLevelTwo=newTapLevel+20;
            beerLevel.style.height = newTapLevelTwo+"px";
            beerLevel.style.backgroundColor="white";
            beerLevel.style.color="#ff4c2e";
        }

        //Putting the filled in template into the div container in the HTML
        dashboardBeerLevel.appendChild(beerLevelClone);
    });
};

function showServingInfo(servingData){
    let orderLength;
    //Cloning the template
    let servingInfoTemplate = document.querySelector("#servingInfoTemplate").content;
    let servingClone = servingInfoTemplate.cloneNode(true);
    //Selecting elements in the clone
    let beersServed = servingClone.querySelector(".beers-served");
    
    //Getting one serving from the "serving" array
    servingData.forEach(function(oneServe){
        //beersServedId is an array that contains all ids of the servings and each time we read something from the serving array, 
        //we check if this serving has been read before by looking it up in the beersServedId array
        if(beersServedIds.includes(oneServe.id)){
            //if the beersServedId contains this serving id, then we do nothing
        }else{
            //if it doesn't contain the serving id, then we add the id to the array and 
            //read the lenth of the order to count the total amount of beers sold
            beersServedIds.push(oneServe.id);
            orderLength = oneServe.order.length;
            allOrders += orderLength;
        }
        
    });

    beersServed.textContent = allOrders;
    //Putting the filled in template into the div container in the HTML
    dashboardServingInfo.appendChild(servingClone);
}

function showQueueData(queueData){
    //Cloning the template
    let queueInfoTemplate = document.querySelector("#queueInfoTemplate").content;
    let queueClone = queueInfoTemplate.cloneNode(true);
    //Selecting elements in the clone
    let peopleInQueue = queueClone.querySelector(".people-in-queue");
    let queueViz = queueClone.querySelector(".queue");

    //Setting the value for the elements in the clone
    peopleInQueue.textContent = "People in queue: "+queueData.length;
    //putting in the images of people in to the queue
    for(i=1; i<=queueData.length; i++){
        let person = document.createElement("img");
        person.setAttribute("src","images/person.svg");
        person.style.height = "100px";
        person.style.width = "50px";

        //If the length of the queue is less than 3, then make the length of the div element that is 
        //accompanying the queue not less that 3*48
        if(queueData.length<=3){
            peopleInQueue.style.width=3*48+"px";
        //Else make the width longer:
        }else{
            peopleInQueue.style.width=queueData.length*48+"px";
        }
        //Put the image of a person into the queue:
        queueViz.appendChild(person);
    }
    //Putting the filled in template into the div container in the HTML
    dashboardQueueInfo.appendChild(queueClone);
};

function showBartenderData(bartenderData) {
    let dashboardBartenderInfo = document.querySelector(".bartender-info");
    dashboardBartenderInfo.innerHTML = "";

    bartenderData.forEach(function(bartender){
        //Cloning the template
        let bartenderInfoTemplate = document.querySelector("#bartenderInfoTemplate").content;
        let bartenderClone = bartenderInfoTemplate.cloneNode(true);
        //Selecting elements in the clone
        let bartenderName = bartenderClone.querySelector(".bartender-name");
        let bartenderStatus = bartenderClone.querySelector(".bartender-status");
        let bartenderPeopleServed = bartenderClone.querySelector(".bartender .people-served");
        let bartenderImg = bartenderClone.querySelector(".bartender-image");

        //Setting the value for the elements in the clone
        bartenderName.textContent = bartender.name;

        if(bartender.status=='WORKING'){
            bartenderStatus.textContent = "Pouring beer";
        }
        if(bartender.status=='READY'){
            bartenderStatus.textContent = "Chilling";
        }

        //Getting info for each bartender
        if(bartender.name=="Jonas"){
            if(bartender.servingCustomer==null){
                
            }else{
                // Counting the amount of customers served
                if(b1Customers.includes(bartender.servingCustomer)){

                }else{
                    b1Customers.push(bartender.servingCustomer);
                }
            }
            bartenderPeopleServed.textContent = b1Customers.length+" customers served";
            bartenderImg.setAttribute("src", "images/1.jpg");
        }
        if(bartender.name=="Peter"){
            if(bartender.servingCustomer==null){
            
            }else{
                if(b2Customers.includes(bartender.servingCustomer)){
                }else{
                    b2Customers.push(bartender.servingCustomer);
                }
            }
            bartenderPeopleServed.textContent = b2Customers.length+" customers served";
            bartenderImg.setAttribute("src", "images/2.jpg");
        }
        if(bartender.name=="Martin"){
            if(bartender.servingCustomer==null){

            }else{
                if(b3Customers.includes(bartender.servingCustomer)){

                }else{
                    b3Customers.push(bartender.servingCustomer);
                }
            }
            bartenderPeopleServed.textContent = b3Customers.length+" customers served";
            bartenderImg.setAttribute("src", "images/3.jpg");
        }

        //Putting the filled in template into the div container in the HTML
        dashboardBartenderInfo.appendChild(bartenderClone);
    });

};

function showBeerTypeData(beertypeData){
    console.log(beertypeData);
    beertypeData.forEach(function(beertype){
        let dashboardBeerInfo = document.querySelector(".beer-info");

        //Cloning the template
        let beerInfoTemplate = document.querySelector("#beerInfoTemplate").content;
        let beerClone = beerInfoTemplate.cloneNode(true);
        //Selecting elements in the clone
        let beerImg = beerClone.querySelector(".beer-img");
        let beerButton = beerClone.querySelector(".btn");
        beerImg.setAttribute("src", "images/"+beertype.label);        

        //Selecting the modal
        let modal = document.querySelector('.modal');
        let closeButton = document.querySelector(".close-btn");

        modal.classList.add("hidden");

        //Showing data in the modal
        function showDetails(data){
            let name = modal.querySelector('.modal-content h2');
            let aroma = modal.querySelector('.aroma');
            let category = modal.querySelector('.category');
            let overallImpression = modal.querySelector('.overall-impression');
            let modalImg = modal.querySelector(".modal-img");

            name.textContent = data.name;
            aroma.textContent = data.description.aroma;
            category.textContent = data.category;
            overallImpression.textContent = data.description.overallImpression;
            modalImg.setAttribute("src","images/"+data.label);

            modal.classList.remove('hidden');
        };

        //Listen for a click on the Learn more button
        beerButton.addEventListener('click', function(e){
            e.preventDefault();
            showDetails(beertype);
        });
        //Listen for the click on the close button
        closeButton.addEventListener("click", function(){
            modal.classList.add("hidden");
        });
        
        //Putting the filled in template into the div container in the HTML
        dashboardBeerInfo.appendChild(beerClone);
    });
};

function showStorageData(storageData){
    //Sorting storage data
    storageData.sort(function (a, b) {
        return a.amount - b.amount;
    });

    storageData.forEach(function(storageUnit){
        //Cloning the template
        let storageInfoTemplate = document.querySelector("#storageInfoTemplate").content;
        let storageClone = storageInfoTemplate.cloneNode(true);
        //Selecting elements in the clone
        let storageStatus = storageClone.querySelector(".storage-status progress");
        let storageName = storageClone.querySelector(".storage-name");
        let storageWarning = storageClone.querySelector(".storage-warning");
        let progressEl = storageClone.querySelector("progress");
        let progressBox = storageClone.querySelector(".progress-box");

        //Setting the value for the elements in the clone
        storageName.textContent = storageUnit.name;
        if(storageUnit.amount==1){
            storageStatus.setAttribute("value", storageUnit.amount+2);
        }
        if(storageUnit.amount>=2){
            storageStatus.setAttribute("value", storageUnit.amount+1);
        }
 
        progressEl.dataset.label=storageUnit.amount+"/10";

        if(storageUnit.amount<3){
            progressBox.classList.add("low-storage");
            storageName.style.color="#ff4c2e";
            storageWarning.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Soon out of stock";
        };
        if(storageUnit.amount>=3&&storageUnit.amount<7){
            progressBox.classList.add("medium-storage");
            storageName.style.color="#ffb32c";
        };
        if(storageUnit.amount>=7){
            progressBox.classList.add("high-storage");
            storageName.style.color="#00e276";
        };

        dashboardStorageInfo.appendChild(storageClone);

        
    });
}








