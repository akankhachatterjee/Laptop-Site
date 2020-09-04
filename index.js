const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');     //__dirname is the dir name that node.js provides which points to home dir
const laptopData = JSON.parse(json);
console.log(laptopData);

const server = http.createServer((req,res) => {
    /*res.writeHead('200',{ 'Content-type': 'text/html'});    //This is res header with 200OK response which we can see in Network of Dev tools
    res.end('This is the response');*/
    
    const pathName = url.parse(req.url, true).pathname;      //In url.parse we send true as it returns an obj with the current pathname like /products
    const id = url.parse(req.url,true).query.id;
    
    //PRODUCTS OVERVIEW
    if(pathName === '/products' || pathName === '/'){
        res.writeHead('200',{ 'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err,data) => {
            
           let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-cards.html`, 'utf-8', (err,data) => {
                
                const cardsOutput = laptopData.map(el => replaceTemplate(data,el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}',cardsOutput);

                res.end(overviewOutput);
            });
        });
    }

    //LAPTOP DETAILS
    else if(pathName === '/laptop' && id< laptopData.length)     //As laptopData returns an array of 5 laptops
    {
        res.writeHead('200',{ 'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/template-laptop.html`,'utf-8', (err,data) => {

            const laptop = laptopData[id];
            const output = replaceTemplate(data,laptop);
            res.end(output);
        })
    }

    //IMAGES(As normally node.js think /img as req and not normal data so we have to handle them seperately using regular exp)
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){

        fs.readFile(`${__dirname}/data/img/${pathName}`, (err,data) => {
            res.writeHead('200',{ 'Content-type': 'image/jpg'});
            res.end(data);
        })
    }

    //URL NOT FOUND
    else{
        res.writeHead('404',{ 'Content-type': 'text/html'});
        res.end('URL was not found on this server!!');
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});

function replaceTemplate(originalHtml, laptop){
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);     //replace returns a string so we chain it to make all the changes in that output only and we use as regular exp as occurance of img can be more than once
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;


}