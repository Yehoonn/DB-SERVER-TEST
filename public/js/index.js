const data = async () => {
  return await fetch("http://localhost:3000/people").then(async (value) => {
    console.log(await value.json());
  });
};

data();
