exports.seed = function (knex) {
  return knex("classes").insert([
    {
      name: "MMA Training",
      type: "Kickboxing",
      class_date: "1 / 4 / 2021",
      start_time: "8:00 AM",
      duration: 1.5, //hours
      intensity: "High",
      location: "Seattle",
      registered_students: 10,
      max_students: 23,
    },

    {
      name: "Yoga On The Hills",
      type: "Yoga",
      class_date: "1 / 5 / 2021",
      start_time: "9:00 AM",
      duration: 2, //hours
      intensity: "low",
      location: "Los Angeles",
      registered_students: 11,
      max_students: 23,
    },
    {
      name: "Time To Dance",
      type: "Zumba",
      class_date: "1 / 6 / 2021",
      start_time: "10:00 AM",
      duration: 1, //hours
      intensity: "High",
      location: "Miami",
      registered_students: 12,
      max_students: 23,
    },
    {
      name: "Calorie Burner",
      type: "Treadmill",
      class_date: " 1 / 7 / 2021",
      start_time: "11:00 AM",
      duration: 1.5, //hours
      intensity: "High",
      location: "New York City",
      registered_students: 13,
      max_students: 23,
    },
    {
      name: "Karate Session",
      type: "Karate",
      class_date: "1 / 8 / 2021",
      start_time: "12:00 PM",
      duration: 1, //hours
      intensity: "Medium",
      location: "Chicago",
      registered_students: 14,
      max_students: 23,
    },
  ]);
};
