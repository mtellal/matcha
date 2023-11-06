

const { FormData } = require('formdata-node')
const { fileFromPath } = require('formdata-node/file-from-path')
const axios = require('axios')
const jwt_decode = require('jwt-decode')

const apiURL = `http://localhost:3000`;

// 400 male names
const maleNames = [
    'Noah Liam', 'Oliver James', 'Elijah William',
    'Henry Lucas', 'Benjamin Theodore', 'Mateo Levi',
    'Sebastian Daniel', 'Jack Michael', 'Alexander Owen',
    'Asher Samuel', 'Ethan Leo', 'Jackson Mason',
    'Ezra John', 'Hudson Luca', 'Aiden Joseph',
    'David Jacob', 'Logan Luke', 'Julian Gabriel',
    'Grayson Wyatt', 'Matthew Maverick', 'Dylan Isaac',
    'Elias Anthony', 'Thomas Jayden', 'Carter Santiago',
    'Ezekiel Charles', 'Josiah Caleb', 'Cooper Lincoln',
    'Miles Christopher', 'Nathan Isaiah', 'Kai Joshua',
    'Andrew Angel', 'Adrian Cameron', 'Nolan Waylon',
    'Jaxon Roman', 'Eli Wesley', 'Aaron Ian',
    'Christian Ryan', 'Leonardo Brooks', 'Axel Walker',
    'Jonathan Easton', 'Everett Weston', 'Bennett Robert',
    'Jameson Landon', 'Silas José', 'Beau Micah',
    'Colton Jordan', 'Jeremiah Parker', 'Greyson Rowan',
    'Adam Nicholas', 'Theo Xavier', 'Hunter Dominic',
    'Jace Gael', 'River Thiago', 'Kayden Damian',
    'August Carson', 'Austin Myles', 'Amir Declan',
    'Emmett Ryder', 'Luka Connor', 'Jaxson Milo',
    'Enzo Giovanni', 'Vincent Diego', 'Luis Archer',
    'Harrison Kingston', 'Atlas Jasper', 'Sawyer Legend',
    'Lorenzo Evan', 'Jonah Chase', 'Bryson Adriel',
    'Nathaniel Arthur', 'Juan George', 'Cole Zion',
    'Jason Ashton', 'Carlos Calvin', 'Brayden Elliot',
    'Rhett Emiliano', 'Ace Jayce', 'Graham Max',
    'Braxton Leon', 'Ivan Hayden', 'Jude Malachi',
    'Dean Tyler', 'Jesus Zachary', 'Kaiden Elliott',
    'Arlo Emmanuel', 'Ayden Bentley', 'Maxwell Amari',
    'Ryker Finn', 'Antonio Charlie', 'Maddox Justin',
    'Judah Kevin', 'Dawson Matteo', 'Miguel Zayden',
    'Camden Messiah', 'Alan Alex', 'Nicolas Felix',
    'Alejandro Jesse', 'Beckett Matias', 'Tucker Emilio',
    'Xander Knox', 'Oscar Beckham', 'Timothy Abraham', 'Andres Gavin',
    'Brody Barrett', 'Hayes Jett', 'Brandon Joel',
    'Victor Peter', 'Abel Edward', 'Karter Patrick',
    'Richard Grant', 'Avery King', 'Caden Adonis',
    'Riley Tristan', 'Kyrie Blake', 'Eric Griffin',
    'Malakai Rafael', 'Israel Tate', 'Lukas Nico',
    'Marcus Stetson', 'Javier Colt', 'Omar Simon',
    'Kash Remington', 'Jeremy Louis', 'Mark Lennox',
    'Callum Kairo', 'Nash Kyler', 'Dallas Crew',
    'Preston Paxton', 'Steven Zane', 'Kaleb Lane',
    'Phoenix Paul', 'Cash Kenneth', 'Bryce Ronan',
    'Kaden Maximiliano', 'Walter Maximus', 'Emerson Hendrix',
    'Jax Atticus', 'Zayn Tobias', 'Cohen Aziel',
    'Kayson Rory', 'Brady Finley', 'Holden Jorge',
    'Malcolm Clayton', 'Niko Francisco', 'Josue Brian',
    'Bryan Cade', 'Colin Andre', 'Cayden Aidan',
    'Muhammad Derek', 'Ali Elian', 'Bodhi Cody',
    'Jensen Damien', 'Martin Cairo', 'Ellis Khalil',
    'Otto Zander', 'Dante Ismael', 'Angelo Brantley',
    'Manuel Colson', 'Cruz Tatum', 'Jaylen Jaden',
    'Erick Cristian', 'Romeo Milan', 'Reid Cyrus',
    'Leonel Joaquin', 'Ari Odin', 'Orion Ezequiel',
    'Gideon Daxton', 'Warren Casey', 'Anderson Spencer',
    'Karson Eduardo', 'Chance Fernando', 'Raymond Bradley',
    'Cesar Wade', 'Prince Julius', 'Dakota Kade',
    'Koa Raiden', 'Callan Hector', 'Onyx Remy',
    'Ricardo Edwin', 'Stephen Kane', 'Saint Titus',
    'Desmond Killian', 'Sullivan Mario', 'Jay Kamari',
    'Luciano Royal', 'Zyaire Marco', 'Wilder Russell',
    'Nasir Rylan', 'Archie Jared', 'Gianni Kashton',
    'Kobe Sergio', 'Travis Marshall', 'Iker Briggs',
    'Gunner Apollo', 'Bowen Baylor', 'Sage Tyson',
    'Kyle Oakley', 'Malik Mathias', 'Sean Armani',
    'Hugo Johnny',
    "Liam Noah",
    "James Oliver",
    "William Elijah",
    "Lucas Henry",
    "Theodore Benjamin",
    "Levi Mateo",
    "Daniel Sebastian",
    "Michael Jack",
    "Owen Alexander",
    "Samuel Asher",
    "Leo Ethan",
    "Mason Jackson",
    "John Ezra",
    "Luca Hudson",
    "Joseph Aiden",
    "Jacob David",
    "Luke Logan",
    "Gabriel Julian",
    "Wyatt Grayson",
    "Maverick Matthew",
    "Isaac Dylan",
    "Anthony Elias",
    "Jayden Thomas",
    "Santiago Carter",
    "Charles Ezekiel",
    "Caleb Josiah",
    "Lincoln Cooper",
    "Christopher Miles",
    "Isaiah Nathan",
    "Joshua Kai",
    "Angel Andrew",
    "Cameron Adrian",
    "Waylon Nolan",
    "Roman Jaxon",
    "Wesley Eli",
    "Ian Aaron",
    "Ryan Christian",
    "Brooks Leonardo",
    "Walker Axel",
    "Easton Jonathan",
    "Weston Everett",
    "Robert Bennett",
    "Landon Jameson",
    "José Silas",
    "Micah Beau",
    "Jordan Colton",
    "Parker Jeremiah",
    "Rowan Greyson",
    "Nicholas Adam",
    "Xavier Theo",
    "Dominic Hunter",
    "Gael Jace",
    "Thiago River",
    "Damian Kayden",
    "Carson August",
    "Myles Austin",
    "Declan Amir",
    "Ryder Emmett",
    "Connor Luka",
    "Milo Jaxson",
    "Giovanni Enzo",
    "Diego Vincent",
    "Archer Luis",
    "Kingston Harrison",
    "Jasper Atlas",
    "Legend Sawyer",
    "Evan Lorenzo",
    "Chase Jonah",
    "Adriel Bryson",
    "Arthur Nathaniel",
    "George Juan",
    "Zion Cole",
    "Ashton Jason",
    "Calvin Carlos",
    "Elliot Brayden",
    "Emiliano Rhett",
    "Jayce Ace",
    "Max Graham",
    "Leon Braxton",
    "Hayden Ivan",
    "Malachi Jude",
    "Tyler Dean",
    "Zachary Jesus",
    "Elliott Kaiden",
    "Emmanuel Arlo",
    "Bentley Ayden",
    "Amari Maxwell",
    "Finn Ryker",
    "Charlie Antonio",
    "Justin Maddox",
    "Kevin Judah",
    "Matteo Dawson",
    "Zayden Miguel",
    "Messiah Camden",
    "Alex Alan",
    "Felix Nicolas",
    "Jesse Alejandro",
    "Matias Beckett",
    "Emilio Tucker",
    "Knox Xander",
    "Beckham Oscar",
    "Abraham Timothy",
    "Gavin Andres",
    "Barrett Brody",
    "Jett Hayes",
    "Joel Brandon",
    "Peter Victor",
    "Edward Abel",
    "Patrick Karter",
    "Grant Richard",
    "King Avery",
    "Adonis Caden",
    "Tristan Riley",
    "Blake Kyrie",
    "Griffin Eric",
    "Rafael Malakai",
    "Tate Israel",
    "Nico Lukas",
    "Stetson Marcus",
    "Colt Javier",
    "Simon Omar",
    "Remington Kash",
    "Louis Jeremy",
    "Lennox Mark",
    "Kairo Callum",
    "Kyler Nash",
    "Crew Dallas",
    "Paxton Preston",
    "Zane Steven",
    "Lane Kaleb",
    "Paul Phoenix",
    "Kenneth Cash",
    "Ronan Bryce",
    "Maximiliano Kaden",
    "Maximus Walter",
    "Hendrix Emerson",
    "Atticus Jax",
    "Tobias Zayn",
    "Aziel Cohen",
    "Rory Kayson",
    "Finley Brady",
    "Jorge Holden",
    "Clayton Malcolm",
    "Francisco Niko",
    "Brian Josue",
    "Cade Bryan",
    "Andre Colin",
    "Aidan Cayden",
    "Derek Muhammad",
    "Elian Ali",
    "Cody Bodhi",
    "Damien Jensen",
    "Cairo Martin",
    "Khalil Ellis",
    "Zander Otto",
    "Ismael Dante",
    "Brantley Angelo",
    "Colson Manuel",
    "Tatum Cruz",
    "Jaden Jaylen",
    "Cristian Erick",
    "Milan Romeo",
    "Cyrus Reid",
    "Joaquin Leonel",
    "Odin Ari",
    "Ezequiel Orion",
    "Daxton Gideon",
    "Casey Warren",
    "Spencer Anderson",
    "Eduardo Karson",
    "Fernando Chance",
    "Bradley Raymond",
    "Wade Cesar",
    "Julius Prince",
    "Kade Dakota",
    "Raiden Koa",
    "Hector Callan",
    "Remy Onyx",
    "Edwin Ricardo",
    "Kane Stephen",
    "Titus Saint",
    "Killian Desmond",
    "Mario Sullivan",
    "Kamari Jay",
    "Royal Luciano",
    "Marco Zyaire",
    "Russell Wilder",
    "Rylan Nasir",
    "Jared Archie",
    "Kashton Gianni",
    "Sergio Kobe",
    "Marshall Travis",
    "Briggs Iker",
    "Apollo Gunner",
    "Baylor Bowen",
    "Tyson Sage",
    "Oakley Kyle",
    "Mathias Malik",
    "Armani Sean",
    "Johnny Hugo"
]

const photosBoys = [
    'photos/boys/photo1.jpg',
    'photos/boys/photo2.jpg',
    'photos/boys/photo3.jpg',
    'photos/boys/photo4.jpg',
    'photos/boys/photo5.jpg',
    'photos/boys/photo6.jpg',
    'photos/boys/photo7.jpg',
    'photos/boys/photo8.jpg',
    'photos/boys/photo9.jpg',
    'photos/boys/photo11.jpg',
    'photos/boys/photo12.jpg',
    'photos/boys/photo13.jpg',
    'photos/boys/photo14.jpg',
    'photos/boys/photo15.jpg',
    'photos/boys/photo16.jpg',
    'photos/boys/photo17.jpg',
    'photos/boys/photo18.jpg',
    'photos/boys/photo19.jpg',
    'photos/boys/photo20.jpg',
    'photos/boys/photo21.jpg',
    'photos/boys/photo22.jpg',
    'photos/boys/photo23.jpg',
    'photos/boys/photo24.jpg',
    'photos/boys/photo25.jpg',
    'photos/boys/photo26.jpg',
    'photos/boys/photo27.jpg',
    'photos/boys/photo28.jpg',
    'photos/boys/photo29.jpg',
    'photos/boys/photo30.jpg',
    'photos/boys/photo31.jpg',
    'photos/boys/photo32.jpg',
]

const photosGirls = [
    'photos/girls/photo1.jpg',
    'photos/girls/photo2.jpg',
    'photos/girls/photo3.jpg',
    'photos/girls/photo4.jpg',
    'photos/girls/photo5.jpg',
    'photos/girls/photo6.jpg',
    'photos/girls/photo7.jpg',
    'photos/girls/photo8.jpg',
    'photos/girls/photo9.jpg',
    'photos/girls/photo10.jpg',
    'photos/girls/photo11.jpg',
    'photos/girls/photo12.jpg',
    'photos/girls/photo13.jpg',
    'photos/girls/photo14.jpg',
    'photos/girls/photo15.jpg',
    'photos/girls/photo16.jpg',
    'photos/girls/photo17.jpg',
    'photos/girls/photo18.jpg',
    'photos/girls/photo19.jpg',
    'photos/girls/photo20.jpg',
    'photos/girls/photo21.jpg',
    'photos/girls/photo22.jpg',
    'photos/girls/photo23.jpg',
    'photos/girls/photo24.jpg',
    'photos/girls/photo25.jpg',
    'photos/girls/photo26.jpg',
    'photos/girls/photo27.jpg',
    'photos/girls/photo28.jpg',
    'photos/girls/photo29.jpg',
    'photos/girls/photo30.jpg',
    'photos/girls/photo31.jpg',
    'photos/girls/photo32.jpg',
    'photos/girls/photo33.jpg',
    'photos/girls/photo34.jpg',
    'photos/girls/photo35.jpg',
    'photos/girls/photo36.jpg',
    'photos/girls/photo37.jpg',
    'photos/girls/photo38.jpg',
]

// 400 female names
const femaleNames = [
    "Olivia Emma",
    "Charlotte Amelia",
    "Sophia Isabella",
    "Ava Mia",
    "Evelyn Luna",
    "Harper Camila",
    "Sofia Scarlett",
    "Elizabeth Eleanor",
    "Emily Chloe",
    "Mila Violet",
    "Penelope Gianna",
    "Aria Abigail",
    "Ella Avery",
    "Hazel Nora",
    "Layla Lily",
    "Aurora Nova",
    "Ellie Madison",
    "Grace Isla",
    "Willow Zoe",
    "Riley Stella",
    "Eliana Ivy",
    "Victoria Emilia",
    "Zoey Naomi",
    "Hannah Lucy",
    "Elena Lillian",
    "Maya Leah",
    "Paisley Addison",
    "Natalie Valentina",
    "Everly Delilah",
    "Leilani Madelyn",
    "Kinsley Ruby",
    "Sophie Alice",
    "Genesis Claire",
    "Audrey Sadie",
    "Aaliyah Josephine",
    "Autumn Brooklyn",
    "Quinn Kennedy",
    "Cora Savannah",
    "Caroline Athena",
    "Natalia Hailey",
    "Aubrey Emery",
    "Anna Iris",
    "Bella Eloise",
    "Skylar Jade",
    "Gabriella Ariana",
    "Maria Adeline",
    "Lydia Sarah",
    "Nevaeh Serenity",
    "Liliana Ayla",
    "Everleigh Raelynn",
    "Allison Madeline",
    "Vivian Maeve",
    "Lyla Samantha",
    "Rylee Eva",
    "Melody Clara",
    "Hadley Julia",
    "Piper Juniper",
    "Parker Brielle",
    "Eden Remi",
    "Josie Rose",
    "Arya Eliza",
    "Charlie Peyton",
    "Daisy Lucia",
    "Millie Margaret",
    "Freya Melanie",
    "Elliana Adalynn",
    "Alina Emersyn",
    "Sienna Mary",
    "Isabelle Alaia",
    "Esther Sloane",
    "Mackenzie Amara",
    "Ximena Sage",
    "Cecilia Valeria",
    "Reagan Valerie",
    "Catalina River",
    "Magnolia Kehlani",
    "Summer Ashley",
    "Andrea Isabel",
    "Oakley Olive",
    "Oaklynn Ember",
    "Kaylee Georgia",
    "Juliette Anastasia",
    "Genevieve Katherine",
    "Blakely Reese",
    "Amaya Emerson",
    "Brianna June",
    "Alani Lainey",
    "Arianna Rosalie",
    "Sara Jasmine",
    "Ruth Adalyn",
    "Ada Bailey",
    "Ariella Wren",
    "Myla Khloe",
    "Callie Elsie",
    "Alexandra Ryleigh",
    "Faith Norah",
    "Margot Zuri",
    "Journee Aspen",
    "Gemma Kylie",
    "Molly Blake",
    "Zara Alaina",
    "Alana Brynlee",
    "Amy Annie",
    "Saylor Ana",
    "Amira Kimberly",
    "Noelle Kamila",
    "Morgan Phoebe",
    "Harmony Sutton",
    "Taylor Finley",
    "Lilah Juliana",
    "Lila Londyn",
    "Kailani Vera",
    "Kaia Angela",
    "Hallie Diana",
    "Lennon Presley",
    "Arabella Aliyah",
    "Lilly Milani",
    "Jordyn Camille",
    "Ariel Aubree",
    "Selena Sawyer",
    "Nyla Delaney",
    "Mariana Rachel",
    "Adaline Leila",
    "Collins Lia",
    "Octavia Kali",
    "Lena Kiara",
    "Kaylani Elaina",
    "Daniela Leia",
    "Gracie Dakota",
    "Elise Hope",
    "Harlow Lola",
    "Stevie Malia",
    "Miriam Alora",
    "Gia Evangeline",
    "Brooke Lilith",
    "Sydney Ophelia",
    "Alayna Tatum",
    "Evie Rowan",
    "Marley Daphne",
    "Kayla Dahlia",
    "Lucille Blair",
    "Adelaide Wrenley",
    "Haven Teagan",
    "Adelyn Alyssa",
    "Payton Jane",
    "Mckenna Celeste",
    "Juliet Palmer",
    "Maggie Rebecca",
    "London Noa",
    "Samara Thea",
    "Kendall Mya",
    "Talia Winter",
    "Angelina Vivienne",
    "Esme Laila",
    "Nina Trinity",
    "Vanessa Mabel",
    "Camilla Jocelyn",
    "Journey Paige",
    "Phoenix Amina",
    "Alivia Amari",
    "Joanna Nicole",
    "Annabelle Raegan",
    "Aitana Julianna",
    "Lauren Catherine",
    "Adriana Madilyn",
    "Harley Tessa",
    "Evelynn Elianna",
    "Rory Dream",
    "Nayeli Poppy",
    "Gabriela Jayla",
    "Cataleya Celine",
    "Hayden Shiloh",
    "Mariah Charlee",
    "Maisie Regina",
    "Adelynn Briella",
    "Giselle Fatima",
    "Danna Alessia",
    "Mckenzie Wynter",
    "Fiona Brooklynn",
    "Gracelynn Luciana",
    "Alexis Everlee",
    "Laura Selah",
    "Reign Alayah",
    "Rosemary Lilliana",
    "Ariyah Heidi",
    "Esmeralda Logan",
    "Amora Kalani",
    "Leighton Cali",
    "Melissa Aniyah",
    "Izabella Michelle",
    "Raelyn Alessandra",
    "Viviana Madeleine",
    "Arielle Serena",
    "Francesca Brynn",
    "Gwendolyn Kira",
    "Destiny Elle",
    "Makayla Alaya",
    "Malani Willa",
    "Saige Makenna",
    "Remington Demi",
    "Emma Olivia",
    "Amelia Charlotte",
    "Isabella Sophia",
    "Mia Ava",
    "Luna Evelyn",
    "Camila Harper",
    "Scarlett Sofia",
    "Eleanor Elizabeth",
    "Chloe Emily",
    "Violet Mila",
    "Gianna Penelope",
    "Abigail Aria",
    "Avery Ella",
    "Nora Hazel",
    "Lily Layla",
    "Nova Aurora",
    "Madison Ellie",
    "Isla Grace",
    "Zoe Willow",
    "Stella Riley",
    "Ivy Eliana",
    "Emilia Victoria",
    "Naomi Zoey",
    "Lucy Hannah",
    "Lillian Elena",
    "Leah Maya",
    "Addison Paisley",
    "Valentina Natalie",
    "Delilah Everly",
    "Madelyn Leilani",
    "Ruby Kinsley",
    "Alice Sophie",
    "Claire Genesis",
    "Sadie Audrey",
    "Josephine Aaliyah",
    "Brooklyn Autumn",
    "Kennedy Quinn",
    "Savannah Cora",
    "Athena Caroline",
    "Hailey Natalia",
    "Emery Aubrey",
    "Iris Anna",
    "Eloise Bella",
    "Jade Skylar",
    "Ariana Gabriella",
    "Adeline Maria",
    "Sarah Lydia",
    "Serenity Nevaeh",
    "Ayla Liliana",
    "Raelynn Everleigh",
    "Madeline Allison",
    "Maeve Vivian",
    "Samantha Lyla",
    "Eva Rylee",
    "Clara Melody",
    "Julia Hadley",
    "Juniper Piper",
    "Brielle Parker",
    "Remi Eden",
    "Rose Josie",
    "Eliza Arya",
    "Peyton Charlie",
    "Lucia Daisy",
    "Margaret Millie",
    "Melanie Freya",
    "Adalynn Elliana",
    "Emersyn Alina",
    "Mary Sienna",
    "Alaia Isabelle",
    "Sloane Esther",
    "Amara Mackenzie",
    "Sage Ximena",
    "Valeria Cecilia",
    "Valerie Reagan",
    "River Catalina",
    "Kehlani Magnolia",
    "Ashley Summer",
    "Isabel Andrea",
    "Olive Oakley",
    "Ember Oaklynn",
    "Georgia Kaylee",
    "Anastasia Juliette",
    "Katherine Genevieve",
    "Reese Blakely",
    "Emerson Amaya",
    "June Brianna",
    "Lainey Alani",
    "Rosalie Arianna",
    "Jasmine Sara",
    "Adalyn Ruth",
    "Bailey Ada",
    "Wren Ariella",
    "Khloe Myla",
    "Elsie Callie",
    "Ryleigh Alexandra",
    "Norah Faith",
    "Zuri Margot",
    "Aspen Journee",
    "Kylie Gemma",
    "Blake Molly",
    "Alaina Zara",
    "Brynlee Alana",
    "Annie Amy",
    "Ana Saylor",
    "Kimberly Amira",
    "Kamila Noelle",
    "Phoebe Morgan",
    "Sutton Harmony",
    "Finley Taylor",
    "Juliana Lilah",
    "Londyn Lila",
    "Vera Kailani",
    "Angela Kaia",
    "Diana Hallie",
    "Presley Lennon",
    "Aliyah Arabella",
    "Milani Lilly",
    "Camille Jordyn",
    "Aubree Ariel",
    "Sawyer Selena",
    "Delaney Nyla",
    "Rachel Mariana",
    "Leila Adaline",
    "Lia Collins",
    "Kali Octavia",
    "Kiara Lena",
    "Elaina Kaylani",
    "Leia Daniela",
    "Dakota Gracie",
    "Hope Elise",
    "Lola Harlow",
    "Malia Stevie",
    "Alora Miriam",
    "Evangeline Gia",
    "Lilith Brooke",
    "Ophelia Sydney",
    "Tatum Alayna",
    "Rowan Evie",
    "Daphne Marley",
    "Dahlia Kayla",
    "Blair Lucille",
    "Wrenley Adelaide",
    "Teagan Haven",
    "Alyssa Adelyn",
    "Jane Payton",
    "Celeste Mckenna",
    "Palmer Juliet",
    "Rebecca Maggie",
    "Noa London",
    "Thea Samara",
    "Mya Kendall",
    "Winter Talia",
    "Vivienne Angelina",
    "Laila Esme",
    "Trinity Nina",
    "Mabel Vanessa",
    "Jocelyn Camilla",
    "Paige Journey",
    "Amina Phoenix",
    "Amari Alivia",
    "Nicole Joanna",
    "Raegan Annabelle",
    "Julianna Aitana",
    "Catherine Lauren",
    "Madilyn Adriana",
    "Tessa Harley",
    "Elianna Evelynn",
    "Dream Rory",
    "Poppy Nayeli",
    "Jayla Gabriela",
    "Celine Cataleya",
    "Shiloh Hayden",
    "Charlee Mariah",
    "Regina Maisie",
    "Briella Adelynn",
    "Fatima Giselle",
    "Alessia Danna",
    "Wynter Mckenzie",
    "Brooklynn Fiona",
    "Luciana Gracelynn",
    "Everlee Alexis",
    "Selah Laura",
    "Alayah Reign",
    "Lilliana Rosemary",
    "Heidi Ariyah",
    "Logan Esmeralda",
    "Kalani Amora",
    "Cali Leighton",
    "Aniyah Melissa",
    "Michelle Izabella",
    "Alessandra Raelyn",
    "Madeleine Viviana",
    "Serena Arielle",
    "Brynn Francesca",
    "Kira Gwendolyn",
    "Elle Destiny",
    "Alaya Makayla",
    "Willa Malani",
    "Makenna Saige",
    "Demi Remington"
]

const tags = [
    "travel",
    "photography",
    "food",
    "sports",
    "books",
    "art",
    "movies",
    "fashion",
    "technology",
    "nature",
    "animals",
    "fitness",
    "science",
    "video games",
    "social",
    "cuisine",
    "do it yourself",
    "astrology",
    "spirituality",
    "adventurous",
    "intellectual",
    "music",
    "career",
    "romantic"
]


function generateNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function sendTags(access_token) {

    const nbTags = generateNumber(2, 10);

    let _tags = [];
    for (let i = 0; i < nbTags; i++) {
        while (1) {
            const index = generateNumber(0, tags.length - 1);
            if (!_tags.length || !_tags.includes(index)) {
                _tags.push(index)
                break;
            }
        }
    }
    _tags = _tags.map(i => tags[i]);
    await axios.patch(`${apiURL}/user/update`, { tags: _tags, biogaphy: "Hi i'm ${name}" }, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return (_tags)
}

function generateGender() {
    const i = generateNumber(0, 2);
    if (i === 0)
        return ("male");
    else if (i === 1)
        return ("female")
    else
        return ("not specified")
}

async function generateRandomCity() {
    return (
        axios.get(`${apiURL}/randomCity`)
            .then(res => {
                return (res.data && (res.data.data ?? ""))
            })
            .catch(err => "")
    )
}

async function generateUser(index) {
    let user = {};
    user.gender = generateGender();

    let name;
    if (user.gender === "male")
        name = maleNames[index];
    else if (user.gender === "female")
        name = femaleNames[index];
    else {
        const i = generateNumber(0, 1);
        if (i)
            name = maleNames[index];
        else
            name = femaleNames[index];
    }

    name = name.split(" ");
    user.email = name[0] + "_" + name[1] + "@gmail.com";
    user.username = name[0];
    user.firstName = name[0];
    user.lastName = name[1];
    user.password = name[0];

    user.city = await generateRandomCity();
    user.age = `${2023 - generateNumber(18, 50)}-01-01`;
    user.sexualPreferences = generateGender();
    return (user)
}

function generatePhotos(gender) {
    let _photos = [];
    const nbPhotos = 1 //generateNumber(1, 3);
    for (let i = 0; i < nbPhotos; i++) {
        if (gender === "male")
            _photos.push(photosBoys[generateNumber(0, photosBoys.length - 1)]);
        else if (gender === "female")
            _photos.push(photosGirls[generateNumber(0, photosGirls.length - 1)]);
        else {
            const g = generateNumber(0, 1);
            if (g)
                _photos.push(photosBoys[generateNumber(0, photosBoys.length - 1)]);
            else
                _photos.push(photosGirls[generateNumber(0, photosGirls.length - 1)]);
        }
    }
    return (_photos);
}

async function sendPhotos(photos, access_token) {
    if (!photos || !photos.length)
        return;

    const formData = new FormData();
    for (let [index, value] of Object.entries(photos)) {
        formData.append('file', await fileFromPath(value, `photo${index}.jpg`, { type: 'image/jpeg' }));
        formData.append('index', index);
    }
    await axios.patch(`${apiURL}/user/photos`, formData, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
}

async function generateViews(userTokens, userIds) {
    if (userTokens.length !== userIds.length) {
        console.log("Err tokens !== ids")
        return;
    }
    process.stdout.write("Generating users views")

    const bestIds = [];
    const worstIds = [];
    let poolIds = [...userIds];

    // generate bestIds

    const range = (poolIds.length - 1) * 0.2;

    // generate more attractive profiles
    for (let i = 0; i < range; i++) {
        const rUserId = generateNumber(0, poolIds.length - 1)
        if (!bestIds.includes(rUserId)) {
            bestIds.push(rUserId);
            poolIds = poolIds.filter((id) => id !== rUserId)
        }
    }

    // generate least attractive profiles
    for (let i = 0; i < range; i++) {
        const rUserId = generateNumber(0, poolIds.length - 1)
        if (!worstIds.includes(rUserId) && !bestIds.includes(rUserId)) {
            worstIds.push(rUserId);
            poolIds = poolIds.filter((id) => id !== rUserId)
        }
    }

    for (let i = 0; i < userTokens.length; i++) {

        process.stdout.write(".")
        let _poolIds = [...poolIds];
        let _worstIds = [...worstIds];
        let _bestIds = [...bestIds];

        let nbViews = 0;
        nbViews = generateNumber(0, (userIds.length - 1) * 0.6)
        while (nbViews > 0) {
            const rNumber = generateNumber(0, 10);
            let index = -1;
            let userId;
            if (rNumber <= 1 && _worstIds.length) {
                index = generateNumber(0, _worstIds.length - 1);
                userId = _worstIds[index];
                _worstIds = _worstIds.filter((id) => id !== userId);
            }
            else if (rNumber <= 4 && _bestIds.length) {
                index = generateNumber(0, _bestIds.length - 1);
                userId = _bestIds[index];
                _bestIds = _bestIds.filter((id) => id !== userId);
            }
            else if (_poolIds.length) {
                index = generateNumber(0, _poolIds.length - 1);
                userId = _poolIds[index];
                _poolIds = _poolIds.filter((id) => id !== userId)
            }
            if (userId) {

                await axios.patch(`${apiURL}/views/${userId}/viewProfile`, {}, {
                    headers: {
                        Authorization: `Bearer ${userTokens[i]}`
                    }
                })
                    .then(res => { })
                    .catch(err => { })
            }
            nbViews--;
        }
    }
    console.log("")
}

async function generateLike(userTokens, userIds) {
    if (userTokens.length !== userIds.length) {
        console.log("Err tokens !== ids")
        return;
    }
    process.stdout.write("Generating users likes")

    const bestIds = [];
    const worstIds = [];
    let poolIds = [...userIds];

    // generate bestIds

    const range = (poolIds.length - 1) * 0.2;

    // generate more attractive profiles
    for (let i = 0; i < range; i++) {
        const rUserId = generateNumber(0, poolIds.length - 1)
        if (!bestIds.includes(rUserId)) {
            bestIds.push(rUserId);
            poolIds = poolIds.filter((id) => id !== rUserId)
        }
    }

    // generate least attractive profiles
    for (let i = 0; i < range; i++) {
        const rUserId = generateNumber(0, poolIds.length - 1)
        if (!worstIds.includes(rUserId) && !bestIds.includes(rUserId)) {
            worstIds.push(rUserId);
            poolIds = poolIds.filter((id) => id !== rUserId)
        }
    }



    for (let i = 0; i < userTokens.length; i++) {

        process.stdout.write(".")
        let _poolIds = poolIds;
        let _worstIds = worstIds;
        let _bestIds = bestIds;

        let nbLikes = 0;
        nbLikes = generateNumber(0, (userIds.length - 1) * 0.2)
        while (nbLikes > 0) {
            const rNumber = generateNumber(0, 10);
            let index = -1;
            let userId;
            if (rNumber <= 1 && _worstIds.length) {
                index = generateNumber(0, _worstIds.length - 1);
                userId = _worstIds[index];
                _worstIds = _worstIds.filter((id) => id !== userId);
            }
            else if (rNumber <= 4 && _bestIds.length) {
                index = generateNumber(0, _bestIds.length - 1);
                userId = _bestIds[index];
                _bestIds = _bestIds.filter((id) => id !== userId);
            }
            else if (_poolIds.length) {
                index = generateNumber(0, _poolIds.length - 1);
                userId = _poolIds[index];
                _poolIds = _poolIds.filter((id) => id !== userId)
            }
            if (userId) {
                await axios.patch(`${apiURL}/likes/${userId}/likeProfile`, {}, {
                    headers: {
                        Authorization: `Bearer ${userTokens[i]}`
                    }
                })
                    .then(res => { })
                    .catch(err => { })
            }
            nbLikes--;
        }
    }
    console.log("")
}


async function createUsers(n) {
    const userTokens = [];
    const userIds = [];

    await resetUsersDatas()

    for (let i = 0; i < n && i < maleNames.length && i < femaleNames.length; i++) {

        const user = await generateUser(i);
        let token = "";
        await axios.post(`${apiURL}/user/signup?fakeUser=true`, user)
            .then(async res => {
                if (res.data && res.data.token) {
                    token = res.data.token;
                    userTokens.push(res.data.token)
                    console.log("User Created ", user.firstName, " \n", token)

                    const photos = generatePhotos(user.gender);
                    await sendPhotos(photos, token)
                        .then(res => { })
                        .catch(err => { console.log("uploadPhoto failed") })
                    await sendTags(token)
                        .then(res => { })
                        .catch(err => { console.log("upload tags failed") })
                }
                else {
                    console.log("User failed ", res.data)
                }
            })
            .catch(err => { console.log("User failed") })
    }

    if (userTokens.length) {
        console.log("Extracting users ids")
        userTokens.map(t => {
            try {
                const token = jwt_decode(t);
                if (token)
                    userIds.push(token.id)
            }
            catch (e) {
                console.log("decode jwt failed")
                // console.log(e)
            }
        })
    }

    if (userIds.length) {
        await generateViews(userTokens, userIds);
        await generateLike(userTokens, userIds);
    }

    console.log("\n")
}


async function resetUsersDatas() {
    await axios.delete(`${apiURL}/user/deleteUsers`)
}

console.log("script ...")
createUsers(process.argv[2] || 150);
