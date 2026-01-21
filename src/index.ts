import App from "./app"

const main = () => {
    const server = new App(); // instance of App class express config

    server.startAPI(); // execute startAPI methode
};

main();