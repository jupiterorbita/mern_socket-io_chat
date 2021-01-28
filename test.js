var animals = ['🐪','🐫','🦙','🦘','🦥','🦨','🐘','🐁','🦔','🐇','🐿','🦎','🐊','🐢','🐍','🐐','🐑','🐏','🐖','🐄','🐃','🐂','🦛','🦏','🦌','🐎','🐆','🐅,','🐈','🐕','🐩','🐕‍🦺','🦮','🦧','🦍','🐒,','🐉','🦕','🦖','🦦','🦈','🐬','🐳','🐋','🐟','🐠','🐡','🦐','🦑','🐙','🦞','🦀','🦆','🐓','🦃','🦅','🦢','🦜','🦩','🦚','🦉','🐧','🦇','🦋','🐌','🐛','🐝','🐞','🦂','🕷'];
var userObjects = []


function createNewEmoji() {
  let animalArrLength = animals.length
  let randIdx = Math.floor(Math.random() * animalArrLength);
  let thisNewUserEmoji = animals[randIdx]
  return thisNewUserEmoji
}



// console.log('thisNewUserEmoji', thisNewUserEmoji)

userObjects.push({
  name: 'john',
  emoji: '🐪'
})
userObjects.push({
  name: 'bob',
  emoji: '🦘'
})
userObjects.push({
  name: 'mary',
  emoji: '🐇'
})
userObjects.push({
  name: 'sue',
  emoji: '🐢'
})

console.log(userObjects);

// find user in db
if (userObjects.find(o => o.name === 'bob')) {
  // assign an emoji
  console.log('sssss')
  let johnsEmoji = userObjects.find(o => o.name === 'bob').emoji
  console.log('johnsEmoji', johnsEmoji)
}

// if (userObjects.includes("john")) {
//   console.log('yes john exits')
// } else {
//   console.log('NO john exits')
//   console.log(userObjects.includes("john"))
// }


let arr = [
  { name:"string 1", value:"this", other: "that" },
  { name:"string 2", value:"this", other: "that" }
];

let obj = arr.find(o => o.name === 'string 1');

console.log(obj);
console.log(arr.find(o => o.name === 'string 1'));
