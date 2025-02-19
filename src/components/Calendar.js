import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './Calendar.css';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyStats, setDailyStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    meals: {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snack: []
    }
  });

  useEffect(() => {
    if (selectedDate) {
      fetchDailyStats(selectedDate);
    }
  }, [selectedDate]);

  const fetchDailyStats = async (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    
    const mealsRef = collection(db, "meals");
    const q = query(mealsRef, where("date", "==", formattedDate));
    const querySnapshot = await getDocs(q);

    let totalCalories = 0;
    let totalProtein = 0;
    let mealsByType = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snack: []
    };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalCalories += parseFloat(data.totalCalories);
      totalProtein += parseFloat(data.totalProtein);
      
      mealsByType[data.mealType].push({
        id: doc.id,
        item: data.item,
        quantity: data.quantity,
        calories: parseFloat(data.totalCalories),
        protein: parseFloat(data.totalProtein)
      });
    });

    setDailyStats({
      totalCalories,
      totalProtein,
      meals: mealsByType
    });
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this meal?")) {
        return;
      }

      await deleteDoc(doc(db, "meals", mealId));
      
      if (selectedDate) {
        fetchDailyStats(selectedDate);
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
      alert("Failed to delete meal. Please try again.");
    }
  };

  const formatNumber = (value) => {
    // Format to 1 decimal place, but only if there's a decimal component
    const formatted = parseFloat(value).toFixed(1);
    return formatted.endsWith('.0') ? Math.floor(value) : formatted;
  };

  const MealSection = ({ title, meals }) => {
    if (meals.length === 0) return null;
    
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);

    return (
      <div className="meal-section">
        <div className="meal-header">
          <h4 className="meal-title">{title}</h4>
          <div className="meal-totals">
            <span>{formatNumber(totalCalories)} cal</span>
            <span>{formatNumber(totalProtein)}g protein</span>
          </div>
        </div>
        <div className="meal-items">
          {meals.map((meal) => (
            <div key={meal.id} className="meal-item">
              <div className="meal-item-main">
                <span className="meal-item-name">{meal.item}</span>
                <span className="meal-item-quantity">x{meal.quantity}</span>
              </div>
              <div className="meal-item-details">
                <div className="meal-item-stats">
                  <span>{formatNumber(meal.calories)} cal</span>
                  <span>{formatNumber(meal.protein)}g protein</span>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteMeal(meal.id)}
                  aria-label="Delete meal"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <div className="calendar-card">
          <h2 className="calendar-title">Meal Calendar</h2>
          
          <div className="calendar-wrapper">
            <ReactCalendar
              onClickDay={(date) => setSelectedDate(date)}
              className="custom-calendar"
              calendarType="iso8601"
              formatShortWeekday={(locale, date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
              showFixedNumberOfWeeks={true}
              showNeighboringMonth={true}
            />
          </div>
          
          {selectedDate && (
            <div className="stats-container">
              <h3 className="stats-date">
                {format(selectedDate, "PPPP")}
              </h3>
              
              <div className="daily-summary">
                <div className="summary-card">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Calories</p>
                    <p className="stat-value">{formatNumber(dailyStats.totalCalories)}</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="stat-icon">💪</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Protein</p>
                    <p className="stat-value">{formatNumber(dailyStats.totalProtein)}g</p>
                  </div>
                </div>
              </div>

              <div className="meals-breakdown">
                <MealSection title="Breakfast" meals={dailyStats.meals.Breakfast} />
                <MealSection title="Lunch" meals={dailyStats.meals.Lunch} />
                <MealSection title="Dinner" meals={dailyStats.meals.Dinner} />
                <MealSection title="Snacks" meals={dailyStats.meals.Snack} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;