import React from "react";
import {categoryInfos} from "./categoryFullinfos";
// import CategoryCard from "./CategoryCard";
import classes from "./category.module.css";
import CategoryCard from "./CategoryCard";
console.log(categoryInfos);
const Category = () => {
  
  return (
    <>
      <section className={classes.Category__container}>
        {categoryInfos.map((info,i) => (
          
            
            <CategoryCard data={info} key={i}/>
        ))}
      </section>
    </>
  );
};
export default Category;
// render into pages in 'Landing'
