import { Request, Response } from "express";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

export const index = async (req: Request, res: Response) => {
  /*
    SELECT tours.*, price * (1 - discount/100) AS price_special
    FROM tours
    JOIN tours_categories ON tours.id = tours_categories.tour_id
    JOIN categories ON tours_categories.category_id = categories.id
    WHERE
      categories.slug = 'du-lich-trong-nuoc'
      AND categories.deleted = false
      AND categories.status = 'active'
      AND tours.deleted = false
      AND tours.status = 'active';
  */

  const slugCategory = req.params.slugCategory;
  console.log(slugCategory);

  const tours = await sequelize.query(`
    SELECT tours.*, price * (1 - discount/100) AS price_special
    FROM tours
    JOIN tours_categories ON tours.id = tours_categories.tour_id
    JOIN categories ON tours_categories.category_id = categories.id
    WHERE
      categories.slug = '${slugCategory}'
      AND categories.deleted = false
      AND categories.status = 'active'
      AND tours.deleted = false
      AND tours.status = 'active';
  `, {
    type: QueryTypes.SELECT,
  });

  for (const item of tours) {
    if(item["images"]) {
      item["images"] = JSON.parse(item["images"]);
      item["image"] = item["images"][0];

      item["price_special"] = parseInt(item["price_special"]);
    }
  }

  res.render("client/pages/tours/index", {
    pageTitle: "Danh sách tour",
    tours: tours
  });
}

export const detail = async (req: Request, res: Response) => {
  const slugTour = req.params.slugTour;

  console.log(slugTour);
  
  res.render("client/pages/tours/detail", {
    pageTitle: "Chi tiết tour",
  });
};