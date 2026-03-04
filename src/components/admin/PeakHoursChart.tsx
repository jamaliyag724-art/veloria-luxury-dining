import React from "react";

const hours = [
"12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"
]

const PeakHoursChart = ()=>{

  return(

    <div className="bg-card border border-border rounded-2xl p-7">

      <h2 className="font-serif text-lg mb-6">
        Peak Hours
      </h2>

      <div className="grid grid-cols-5 gap-4">

        {hours.map(hour=>(
          <div
          key={hour}
          className="bg-primary/10 text-primary p-4 rounded-lg text-center"
          >
            {hour}
          </div>
        ))}

      </div>

    </div>

  )

}

export default PeakHoursChart
