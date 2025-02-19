import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { format } from "date-fns";
import './Home.css';

const Homepage = () => {
  const [mealType, setMealType] = useState("Breakfast");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item || !calories || !protein) return;
  
    // Use parseFloat instead of parseInt and round to 1 decimal place
    const totalCalories = parseFloat((quantity * parseFloat(calories)).toFixed(1));
    const totalProtein = parseFloat((quantity * parseFloat(protein)).toFixed(1));
    const date = format(new Date(), "yyyy-MM-dd");
  
    try {
      await addDoc(collection(db, "meals"), {
        mealType,
        item,
        quantity: parseFloat(quantity),
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        totalCalories,
        totalProtein,
        date,
        timestamp: serverTimestamp(),
      });

      // Show success message
      const successMessage = document.getElementById('success-message');
      successMessage.classList.add('show');
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 3000);

      setItem("");
      setQuantity(1);
      setCalories("");
      setProtein("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  
  return (
    <div className="homepage">
      <div className="content-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Track Your Meal</h2>
            <p className="form-subtitle">Log your meals to track your nutrition goals</p>
          </div>

          <form onSubmit={handleSubmit} className="meal-form">
            <div className="input-group">
              <label>
                <span className="label-text">Meal Type</span>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="input-select"
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snack</option>
                </select>
              </label>
            </div>

            <div className="input-group">
              <label>
                <span className="label-text">Food Item</span>
                <input
                  type="text"
                  placeholder="What did you eat?"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="input-text"
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>
                  <span className="label-text">Quantity</span>
                  <input
                    type="number"
                    placeholder="How many?"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="input-number"
                    required
                  />
                </label>
              </div>
              <div className="input-group">
                <label>
                  <span className="label-text">Calories/Item</span>
                  <input
                    type="number"
                    placeholder="Calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    step="0.1"
                    min="0"
                    className="input-number"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="input-group protein-group">
              <label>
                <span className="label-text">Protein/Item (g)</span>
                <input
                  type="number"
                  placeholder="Protein in grams"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  step="0.1"
                  min="0"
                  className="input-number"
                  required
                />
              </label>
            </div>

            <button type="submit" className="submit-button">
              <span className="button-text">Log Meal</span>
              <span className="button-icon">→</span>
            </button>
          </form>

          <div id="success-message" className="success-message">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;