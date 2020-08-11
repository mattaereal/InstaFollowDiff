/* Instagram followers/following diff (this should've been a gist)

The most humanly possible way that I have found of checking out who does not
follow you back. I found the original repo, and used it as a starting point.
Changed many things, improved the efficiency and updated the class name's for
the necessary DOM selectors. All selectors must be grabbed manually.
A detailed explanation on how to get it with Instagram's current front end
design may be found here in a while.

Selectors brief explanation:
counterList : counters from posts, followers and following section.
userList : from followers/following pop up users list.
usernameElement : from username element in pop up lists.
popUpContentDiv : popUp's content div (for scrolling).
*/
selector = {
    counterList : "Y8-fY", // from posts, follwers and following counter.
    userList : "PZuss", // from followers/following pop up users list.
    usernameElement : "_0imsa", // from username element in pop up lists.
    popUpContentDiv : "isgrP" // popUp's content div (for scrolling).
}

// One array per type of users. The diff will be done between them.
followers = Array();
following = Array();

// From the div list, it gets the elements for followers and following counters.
followersElement = document.getElementsByClassName(selector.counterList)[1];
followingElement = document.getElementsByClassName(selector.counterList)[2];

// Gets following and followers count.
maxLenFollowing = followingElement.getElementsByTagName('span')[0].innerText;
maxLenFollowing = Number(maxLenFollowing.replace(',', ''));
maxLenFollowers = followersElement.getElementsByTagName('span')[0].innerText;
maxLenFollowers = Number(maxLenFollowers.replace(',', ''));

// Event creation
eventScrollDownFollowers = new CustomEvent(
    "harvestPopUpFollowers", {
        bubbles: true,
        cancelable: true
    }
);

eventScrollDownFollowing = new CustomEvent(
    "harvestPopUpFollowing", {
        bubbles: true,
        cancelable: true
    }
);

// Adding listeners
document.addEventListener("harvestPopUpFollowers", harvestPopUpFollowers, false);
document.addEventListener("harvestPopUpFollowing", harvestPopUpFollowing, false);

/* Updates followers array from dom when called 
(should be used when pop up is active) */
function updateFollowers() {
    tmp = document.getElementsByClassName(selector.usernameElement);
    popup = document.getElementsByClassName(selector.popUpContentDiv);
    listLength = tmp.length;
    for (i = 0; i < tmp.length; i++) {
        if (tmp[0] != undefined) {
            followers.push(tmp[0].innerHTML);
            popup[0].children[0].children[0].children[0].remove();
        }
    }
}

/* Updates following users array */
function updateFollowing() {
    tmp = document.getElementsByClassName(selector.usernameElement);
    popup = document.getElementsByClassName(selector.popUpContentDiv);
    listLength = tmp.length;
    for (i = 0; i < tmp.length; i++) {
        if (tmp[0] != undefined) {
            following.push(tmp[0].innerHTML);
            popup[0].children[0].children[0].children[0].remove();
        }
    }
}

/* "Core" functionality. It opens up the followers div, and scrolls down,
pushing them into the followers array, and deletes them visually in order not to
consume resources.

After finishing it calls a similar function to do the same with following users.*/
function harvestPopUpFollowers() {
    try {
        popUpContentDiv = document.getElementsByClassName(selector.popUpContentDiv)[0];
        console.log(`current/total | ${followers.length}/${maxLenFollowers}`);
        if (followers.length < maxLenFollowers) {
            console.log("Entering harvestPopUpFollowers.")
            popUpContentDiv.scrollTop = popUpContentDiv.scrollHeight;
            setTimeout(function() {
                followersElement.dispatchEvent(eventScrollDownFollowers);
            }, 1500)
            console.log("Dispatched eventScrollDownFollowers.")
            console.log("Updating followers after dispatch.");
            updateFollowers();
        } else {
            console.log("Final followers update.");
            updateFollowers();
            followingElement.getElementsByTagName('a')[0].click();
            setTimeout(function() {
                harvestPopUpFollowing();
            }, 1500);
        }
    } catch (e) {
        console.log(e);
    }
}

/* From the people I follow, add the ones that don't follow me. */
function getUnfollowers() {
    notFollowingBack = Array();
    for (i = 0; i < following.length; i++) {
        if (!followers.includes(following[i])) {
            notFollowingBack.push(following[i]);
        }
    }

    console.log("People not following back");
    for (let i = 0; i < notFollowingBack.length; i++) {
        console.log((i + 1) + ") https://instagram.com/" + notFollowingBack[i]);
    }
}

/* It opens up the following div, and scrolls down, pushing users into the
following array, and deletes them visually in order not to consume resources. 

After finishing, it prints out who are not following that profile. */
function harvestPopUpFollowing() {
    try {
        popUpContentDiv = document.getElementsByClassName(selector.popUpContentDiv)[0];
        console.log(`current/total | ${following.length}/${maxLenFollowing}`);
        if (following.length < maxLenFollowing) {
            console.log("Entering harvestPopUpFollowing")
            popUpContentDiv.scrollTop = popUpContentDiv.scrollHeight;
            setTimeout(function() {
                followingElement.dispatchEvent(eventScrollDownFollowing);
            }, 1500)
            console.log("Dispatched eventScrollDownFollowing.")
            console.log("Updating following after dispatch.");
            updateFollowing();
        } else {
            console.log("Final following update.");
            updateFollowing();
            setTimeout(function() {
                getUnfollowers();
            }, 1500);
        }
    } catch (e) {
        console.log(e);
    }
}

/* Main alike
It starts simulating a click on the followers list, and waits for it before
trying to call harvestPopUpFollowers.
*/
followersElement.getElementsByTagName('a')[0].click();
setTimeout(function() {
    harvestPopUpFollowers();
}, 1500);