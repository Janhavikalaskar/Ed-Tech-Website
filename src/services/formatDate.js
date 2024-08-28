
export const formatDate = (timestamp) => {

try{
    // Create a new Date object with the provided timestamp
const newtime = parseInt(timestamp)
const newdate = new Date(newtime)


// Get the local date components
const localYear = newdate.getFullYear();
const localMonth = newdate.getMonth() +1; // Months are zero-based, so we add 1
const localDay = newdate.getDate();
const localHours = newdate.getHours();
const localMinutes = newdate.getMinutes();
const localSeconds = newdate.getSeconds();

// Formatting the local date as a string
const localDateStr = `${localYear}-${localMonth < 10 ? '0' : ''}${localMonth}-${localDay < 10 ? '0' : ''}${localDay}`;
const localTimeStr = `${localHours < 10 ? '0' : ''}${localHours}:${localMinutes < 10 ? '0' : ''}${localMinutes}:${localSeconds < 10 ? '0' : ''}${localSeconds}`;

// Combining date and time
return`${localDateStr} ${localTimeStr}`;
}
catch(err){
    console.log("err while formating date",err)
}


  }




