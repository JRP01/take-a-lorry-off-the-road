var boxes = require('./Data/boxes.json');
var orders = require('./Data/orders.json');

let orderAreaArr = [];
let boxAreaArr = [];
let orderAndBox = [];


/// Calculate area for each order and add info to new array
orders.map((order) => {
  let area = order.ingredients.reduce((sum, ingredient) => sum + ingredient.volumeCm3, 0);
  orderAreaArr.push({ ...order, area });
});

/// Calculate area for each Box and add info to new array
boxes.map((box) => {
  let dimensions = box.dimensions;
  let areaCm3 =
    (dimensions.depthMm * dimensions.heightMm * dimensions.widthMm) / 1000;
  boxAreaArr.push({ ...box, areaCm3 });
});

///Sort boxes largest to smallest
const orderedBoxesLargetoSmall = boxAreaArr.sort(
  (a, b) => b.areaCm3 - a.areaCm3
);
///Sort boxes smallest to largest
const orderedBoxesSmalltoLarge = [...orderedBoxesLargetoSmall].reverse();

//Match order with correct box then add to array
orderAreaArr.map((order) => {
  let selectedBox = orderedBoxesSmalltoLarge.filter((box) => {
    return box.areaCm3 > order.area;
  });
  selectedBox = selectedBox[0];
  let orderId = order.id;
  let selectedBoxId = selectedBox.id;
  let co2FootprintKg = selectedBox.co2FootprintKg;

  orderAndBox.push({ orderId, selectedBoxId, co2FootprintKg });
});

///Calculate max Co2 (largest box Co2 * number of orders)
let largestBox = orderedBoxesLargetoSmall[0];
const maxCo2 = largestBox.co2FootprintKg * orders.length;

//Calculate intelligent Co2 (sum of co2 footprint for matched orders)
const intelligentCo2 = orderAndBox.reduce(
  (sum, box) => sum + box.co2FootprintKg,
  0
);

console.log("Standard Footprint " + maxCo2);
console.log("Intelligent Footprint " + intelligentCo2);
if (maxCo2 - intelligentCo2 > 1000) {
  console.log("Success a lorry was removed from the road");
}
console.log("Order & Box Matches: ", orderAndBox);
