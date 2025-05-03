export function IngredientsList(props){
    let ingredientsListItems= props.ingredients.map((item)=>(
        <li key={item}>{item}</li>
    ));
  
    return (
        <section>
        <h2>Ingredients on hand : </h2>
        <ul className="ingredients-list" aria-live="polite">
          {ingredientsListItems}
        </ul>
            {props.ingredients.length>3 &&<div className="get-recipe-container">
                <div ref={props.SectionRef}>
                  <h3>Ready for a recipe?</h3>
                  <p>Generate a recipe for your list of ingredients.</p>
                </div>
                <button onClick={props.toggleRecipeShown}>Get a recipe</button>
            </div>
            }
            
        </section>
    )
}