import React from "react";
import { IngredientsList } from "./ingredientsList";
import { ClaudeRecipe } from "./claudeRecipe";
import {getRecipeFromMistral} from "../ai.js"
import loadingGIF from "../assets/loading.gif";

export function Main(){
  //  const ingredients=["Chicken","Oregano","Tomatoes"];



  let[ingredients , setIngredients] =React.useState([]);
 
// Not for react vite ... it is for server frameworks like next js   
//put form action={addIngredients}
//   function addIngredients(formData){
//     const newIngredient=formData.get("ingredient");
//     setIngredients(prevIngredients=>[...prevIngredients,newIngredient]) 
//   }


  function handleSubmit(event){
    event.preventDefault();
    const formData=new FormData(event.currentTarget);
    const newIngredient=formData.get("ingredient");
    if(newIngredient){
    setIngredients(prevIngredients=>[...prevIngredients,newIngredient])
    }
    event.currentTarget.reset(); 
  }

  const [recipeShown,setRecipeShown]=React.useState("");


                                    //code for loading gif and fetching data from api
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function toggleRecipeShown(){
    // setRecipeShown(prevState=>
    //     !prevState)
    setLoading(true); 
    setError(null);  
    try{
      const recipeMarkdown=await getRecipeFromMistral(ingredients)
      setRecipeShown(recipeMarkdown)
    }catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

  }




 


  //code to scroll into the section where ready for recipe box is placed
  const recipeSection=React.useRef(null);
  React.useEffect(
    ()=>{
     if(recipeShown!=="" && recipeSection!==null){
      recipeSection.current.scrollIntoView({behaviour: "smooth"})
     }
    },[recipeShown]
  )


   return (
    <main>
        <form onSubmit={handleSubmit} className="add-ingredient-form" >
            <input type="text" placeholder="e.g. oregano" aria-label="add-ingredient" name="ingredient"/>
            <button>+ Add ingredients</button>
        </form>
          {loading && <div className="loading-gif"><img  className="loading-gif" src={loadingGIF} alt="loading-gif"/></div>}
          { ingredients.length>0 && <IngredientsList  SectionRef={recipeSection} ingredients={ingredients}  toggleRecipeShown={toggleRecipeShown}/>}
          {recipeShown && <ClaudeRecipe recipeShown={recipeShown}/>}
          {error && <p className="text-red-500">{error}</p>}

    </main>
    

   );
}

