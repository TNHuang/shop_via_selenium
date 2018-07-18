const chromeDriver = require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');

// time in millseconds
const waitTimeout = 5000;
// number of browser you want to operate simutaneously, set it to 15 if you want to buy 15 items at the same time
const numberOfUsers = 3;

function sleep(sleepSeconds) {
	return new Promise((resolve) => {
		setTimeout(() => { 
			return resolve();
		}, sleepSeconds);
	});
}

// user info, you need to fill it out with real info and payment info
// url denote the start page you want the webdriver to go to at the start
// item name represent the item you want to buy
const defaultOption = {
	url: "https://yeezysupply.com/collections/new-arrivals-footwear",
	itemName: "MEN'S NYLON",
	size: "39",
	email: "test_email@gmai.com",
	firstName: "test-first-name",
	lastName: "test-last-name",
	line1: "test line 1",
	line2: "apt #123",
	country: "United States",
	city: "New York",
	province: "New York",
	zip: "12345",
	phone: "1-234-567-8901"
};

function generateActionConfig(option) {
	const {
		url,
		itemName,
		size,		
		email,
		firstName,
		lastName,
		line1,
		line2,
		city,
		country,
		province,
		zip,
		phone
	} = option;

	/*
		each element in action has three part
		{ 
			identifer: <css select on the page, can match by text as well>,
			actionType: "click" <type of action, IE: click, input or select (for drop down)>,
			postActionDelay: 500 <optional parameter, denote how many millsecond to wait after you click the button>
			// some button require some time to load, need to be custom adjust
		},

		each action in actions array is perform in sequence
		The action sequences below is an example for buying a Men's nylon slipper in yeezysupply.com
		you can buy more pair by add more action sequence.
		filling out payment information is done the same way

		you will need to find the css selector for each website.
		since each site has different css selectors.
	*/
	return {
		url,
		actions: [
			{ 
				identifer: By.partialLinkText(itemName),
				actionType: "click",
				postActionDelay: 500
			},
			{ 
				identifer: By.css(".PI__select"),
				actionType: "select",
				value: size
			},
			{ 
				identifer: By.css(".K__button"),
				actionType: "click",
				postActionDelay: 500
			},
			{ 
				identifer: By.css(".MC__button_checkout"),
				actionType: "click"
			},
			{ 
				identifer: By.css("#checkout_email"),
				actionType: "input",
				value: email
			},
			{ 
				identifer: By.css("#checkout_shipping_address_first_name"),
				actionType: "input",
				value: firstName
			},
			{ 
				identifer: By.css("#checkout_shipping_address_last_name"),
				actionType: "input",
				value: lastName
			},
			{ 
				identifer: By.css("#checkout_shipping_address_address1"),
				actionType: "input",
				value: line1
			},
			{ 
				identifer: By.css("#checkout_shipping_address_address2"),
				actionType: "input",
				value: line2
			},
			{ 
				identifer: By.css("#checkout_shipping_address_city"),
				actionType: "input",
				value: city
			},
			{ 
				identifer: By.css("#checkout_shipping_address_country"),
				actionType: "select",
				value: country
			},
			{ 
				identifer: By.css("#checkout_shipping_address_province"),
				actionType: "select",
				value: province
			},
			{ 
				identifer: By.css("#checkout_shipping_address_zip"),
				actionType: "input",
				value: zip
			},
			{ 
				identifer: By.css("#checkout_shipping_address_phone"),
				actionType: "input",
				value: phone
			},
			{ 
				identifer: By.css("#salesFinal"),
				actionType: "click",
				postActionDelay: 300
			},
			{ 
				identifer: By.css(".step__footer__continue-btn"),
				actionType: "click",
				postActionDelay: 500
			}
		]
	};
}

async function promiseToPeformActionSequence(actionConfig) {
	const driver = await new Builder().forBrowser('chrome').build();
	
	try {
		await driver.get(actionConfig.url);

	    const len = actionConfig.actions.length;
	    let idx = 0;

	    while (idx < len) {
	    	const action = actionConfig.actions[idx++];
	    	const element = await driver.wait(
				until.elementLocated(action.identifer),
				waitTimeout
			).catch((e) => { 
				console.log("fail to find element with identifer:", action.identifer);
				console.log(e);
			});

			if (element) {
				switch (action.actionType) {
		    		case "click":
		    			await element.click();
		    			break;
					case "select":
						await element.sendKeys(action.value);
						break;
					case "input":
						await element.sendKeys(action.value);
						break;
					default:
						console.log("no action found, will do nothing...");
		    	}

		    	if (action.postActionDelay) {
		    		await sleep(action.postActionDelay);
		    	}	
			}
	    }
	} catch (e) {
		console.log("action fail to perform:", e);
	}
	

    return Promise.resolve(true);
}

(async function actionsDriver() {
  try {
   	const promises = [];
   	let idx = 0;

   	while (idx < numberOfUsers) {
   		const actions = generateActionConfig(defaultOption);

   		promises.push(promiseToPeformActionSequence(actions));
   		idx++;
   	}

   	return Promise.all(promises);
  } catch(e) {
  	console.log("regular err", e);
  } finally {
    // await driver.quit();
  }

  return Promise.resolve(true);
})();