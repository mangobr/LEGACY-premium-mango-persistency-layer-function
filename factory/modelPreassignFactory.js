const modelPreassignFactory = (labeledFood, nutritionalFacts) => {
  return {
    label: labeledFood,
    nutritionalFacts: nutritionalFacts,
  };
};

const create = (labeledFood, nutritionalFacts) => {
  return modelPreassignFactory(labeledFood, nutritionalFacts);
};

module.exports = create;
