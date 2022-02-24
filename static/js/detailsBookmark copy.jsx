"use strict";

// Hikes in a Bookmarks List Component
function HikeBookmark(props) {
  const hike_id = Number(document.querySelector("#hike_id").innerText);

  // Check if user wants to delete or not
  function deleteConfirm(event) {
    const validate = confirm("Do you want to remove this hike from this list?");
    if (!validate) {
      event.preventDefault();
    } else {
      removeExistingHikeFromList();
    }
  }

  // Process deletion
  function removeExistingHikeFromList() {
    fetch(`/${props.bookmarks_list_id}/${props.hike_id}/remove-hike`, {
      method: "DELETE",
    }).then((response) => {
      response.json().then((jsonResponse) => {
        console.log(jsonResponse);
        if (hike_id === props.hike_id) {
          props.refreshLists();
        } else {
          props.removeHike();
        }
      });
    });
  }

  return (
    <React.Fragment>
      <div className="row ">
        <div className="clearfix">
          <div className="d-flex float-start">
            <button
              className="btn btn-sm"
              style={{ padding: 0 }}
              type="submit"
              onClick={deleteConfirm}
            >
              <small>
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="remove from list"
                  className="bi bi-x"
                ></i>
              </small>
            </button>
            &nbsp;&nbsp;
            <a className="link-dark" href={`/hikes/${props.hike_id}`}>
              {props.hike_name}
            </a>
          </div>
        </div>
      </div>
      <div className="row">
        <small>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {props.difficulty} | {props.miles} miles | {props.city}, {props.state}{" "}
          | {props.area} | {props.leash_rule} | {props.parking}
        </small>
      </div>
    </React.Fragment>
  );
}

// Bookmarks List Component
function BookmarksList(props) {
  const [hikes, setHikes] = React.useState([]);

  // Get all hikes for the bookmarks list
  function getHikes() {
    fetch(`/${props.bookmarks_list_id}/hikes.json`)
      .then((response) => response.json())
      .then((data) => {
        setHikes(data.bookmarksLists.hikes);
      });
  }

  // Initial render of all hikes in the bookmarks list
  React.useEffect(() => {
    getHikes();
  }, []);

  // When all hikes are set, make an array of HikeBookmark Components
  const allHikeBookmarks = [];

  // the following line will print out the hikes
  // pay attention to what it is initially and what it is when the component re-renders
  console.log(`hikes: `, hikes);

  for (const currentHike of hikes) {
    allHikeBookmarks.push(
      <HikeBookmark
        key={currentHike.hike_id}
        area={currentHike.area}
        city={currentHike.city}
        difficulty={currentHike.difficulty}
        hike_id={currentHike.hike_id}
        bookmarks_list_id={props.bookmarks_list_id}
        hike_name={currentHike.hike_name}
        leash_rule={currentHike.leash_rule}
        miles={currentHike.miles}
        parking={currentHike.parking}
        state={currentHike.state}
        removeHike={removeHike}
        refreshLists={refreshLists}
      />
    );
  }

  // Use getHikes() to set hikes when a hike is removed
  function removeHike() {
    getHikes();
  }

  function refreshLists() {
    props.getBookmarksLists();
  }

  // Check if user wants to delete or not
  function deleteConfirm(event) {
    const validate = confirm("Do you want to delete this list?");
    if (!validate) {
      event.preventDefault();
    } else {
      deleteExistingBookmarksList();
    }
  }

  // Process deletion
  function deleteExistingBookmarksList() {
    fetch(`/delete-bookmarks-list/${props.bookmarks_list_id}`, {
      method: "DELETE",
    }).then((response) => {
      response.json().then((jsonResponse) => {
        console.log(jsonResponse);
        props.getBookmarksLists();
      });
    });
  }

  return (
    <React.Fragment>
      <div className="card mt-1">
        <div className="card-header">
          <div className="clearfix">
            <div className="float-start">
              <a
                className="btn btn-sm"
                data-bs-toggle="collapse"
                href={`#collapse-bookmarks-${props.bookmarks_list_id}`}
                role="button"
                aria-expanded="false"
                aria-controls={`collapse-bookmarks-${props.bookmarks_list_id}`}
              >
                {props.bookmarks_list_name}{" "}
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="view all hikes in list"
                  className="bi bi-caret-down"
                ></i>
              </a>
            </div>

            <div className="d-flex float-end">
              <label className="sr-only">Add To List</label>
              <button
                className="btn btn-sm"
                data-bs-toggle="modal"
                data-bs-target={`#modal-add-hikes-${props.bookmarks_list_id}`}
              >
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="add hikes to list"
                  className="bi bi-plus"
                ></i>
              </button>
              <label className="sr-only">Rename List</label>
              <button
                className="btn btn-sm"
                data-bs-toggle="modal"
                data-bs-target={`#modal-rename-bookmark-${props.bookmarks_list_id}`}
              >
                <small>
                  <i
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="rename list"
                    className="bi bi-pencil"
                  ></i>
                </small>
              </button>
              <label className="sr-only">Delete List</label>
              <button
                className="btn btn-sm"
                type="submit"
                onClick={deleteConfirm}
              >
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="delete list"
                  className="bi bi-x"
                ></i>
              </button>
            </div>
          </div>
        </div>

        <div
          className="collapse card-body"
          id={`collapse-bookmarks-${props.bookmarks_list_id}`}
        >
          <div>{allHikeBookmarks}</div>
        </div>
      </div>
    </React.Fragment>
  );
}

function RenameBookmarksList(props) {
  // Process renaming bookmarks list name
  const [bookmarksListName, setBookmarksListName] = React.useState(
    `${props.bookmarks_list_name}`
  );

  function editExistingBookmarksList() {
    fetch(`/edit-bookmarks-list/${props.bookmarks_list_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        bookmarksListName,
      }),
    })
      .then((response) => {
        response.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.getBookmarksLists();
        props.setListOptionsState();
      });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={`modal-rename-bookmark-${props.bookmarks_list_id}`}
        tabIndex="-1"
        aria-labelledby={`modal-rename-bookmark-${props.bookmarks_list_id}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`modal-rename-bookmark-${props.bookmarks_list_id}-label`}
              >
                Rename List
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="bookmarksListNameInput">List Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={bookmarksListName}
                  onChange={(event) => setBookmarksListName(event.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={editExistingBookmarksList}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function CreateBookmarksList(props) {
  // Process creating a new bookmarks list
  const [bookmarksListName, setBookmarksListName] = React.useState("");

  function createNewBookmarksList() {
    fetch("/create-bookmarks-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        bookmarksListName,
      }),
    })
      .then((response) => {
        response.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.getBookmarksLists();
      });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={"modal-create-bookmarks-list"}
        tabIndex="-1"
        aria-labelledby={"modal-create-bookmarks-list-label"}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={"modal-create-bookmarks-list-label"}
              >
                Create List
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="bookmarksListNameInput">List Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hikes I Want To Visit"
                  value={bookmarksListName}
                  onChange={(event) => setBookmarksListName(event.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={createNewBookmarksList}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// function AddHikesToBookmarksList(props) {
//   const session_login = document.querySelector("#login").innerText;
//   // Set Hike options
//   const [allHikesOptions, setAllHikesOptions] = React.useState("");

//   console.log(props.bookmarks_list_id);
//   console.log(props.hikes);

//   function setHikesOptionsState() {
//     fetch("/all_hikes.json").then((response) =>
//       response.json().then((jsonResponse) => {
//         const hikes = jsonResponse.hikes;
//         const allHikeOptions = [];

//         // go through each hike
//         // if hike is found in current bookmarks_list's hikes, add to list as true
//         // otherwise, add as false
//         hikes.map((responseHike) => {
//           let hikeOnList = false;
//           for (const propsHike of props.hikes) {
//             if (propsHike.hike_id === responseHike.hike_id) {
//               hikeOnList = true;
//             }
//           }

//           // if (props.hikes.map((a) => a.hike_id).includes(hike.hike_id)) {
//           //   hikeOnList = true;
//           // }

//           if (hikeOnList) {
//             allHikeOptions.push({
//               select: true,
//               hike_name: responseHike.hike_name,
//               hike_id: responseHike.hike_id,
//             });
//           } else {
//             allHikeOptions.push({
//               select: false,
//               hike_name: responseHike.hike_name,
//               hike_id: responseHike.hike_id,
//             });
//           }
//         });
//         setAllHikesOptions(allHikeOptions);
//       })
//     );
//   }

//   if (session_login === "True") {
//     React.useEffect(() => {
//       setHikesOptionsState();
//     }, []);
//     // console.log(allHikesOptions);
//   }

//   console.log("allHikesOptions", allHikesOptions);

//   function addHikesToBookmarksList() {
//     fetch(`/${props.bookmarks_list_id}/add-hikes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         allHikesOptions, // returns list of objects
//       }),
//     }).then((response) => {
//       response.json().then((jsonResponse) => {
//         setHikesOptionsState();
//         props.getBookmarksLists();
//         console.log(jsonResponse);
//         console.log("allHikesOptions", allHikesOptions);
//       });
//     });
//   }

//   return (
//     <React.Fragment>
//       <div
//         className="modal fade"
//         id={`modal-add-hikes-${props.bookmarks_list_id}`}
//         tabIndex="-1"
//         aria-labelledby={`#modal-add-hikes-${props.bookmarks_list_id}-label`}
//         aria-hidden="true"
//       >
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5
//                 className="modal-title"
//                 id={`#modal-add-hikes-${props.bookmarks_list_id}-label`}
//               >
//                 Add Hikes
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <div className="mb-3">
//                 <label className="form-label" htmlFor="hikesInput">
//                   Hikes
//                 </label>
//                 <div style={{ height: "50vh", overflow: "auto" }}>
//                   {allHikesOptions !== ""
//                     ? allHikesOptions.map((hikeOption) => (
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id={`add-hike-${hikeOption.hike_id}-to-list-${props.bookmarks_list_id}`}
//                             value={hikeOption.hike_id}
//                             checked={hikeOption.select}
//                             onChange={(event) => {
//                               let checked = event.target.checked;
//                               setAllHikesOptions(
//                                 allHikesOptions.map((data) => {
//                                   if (hikeOption.hike_id === data.hike_id) {
//                                     data.select = checked;
//                                   }
//                                   return data;
//                                 })
//                               );
//                             }}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor={`add-hike-${hikeOption.hike_id}-to-list-${props.bookmarks_list_id}`}
//                           >
//                             {hikeOption.hike_name}
//                           </label>
//                         </div>
//                       ))
//                     : null}
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="submit"
//                   className="btn btn-sm btn-outline-dark btn-block mt-4"
//                   data-bs-dismiss="modal"
//                   onClick={addHikesToBookmarksList}
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-secondary btn-block mt-4"
//                   data-bs-dismiss="modal"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// }

function AddCurrentHikeToBookmarksList(props) {
  const hike_id = document.querySelector("#hike_id").innerText;
  const session_login = document.querySelector("#login").innerText;

  // option to add to existing bookmarks list OR create new list with hike on it

  // For adding to existing list
  const [allBookmarksListOptions, setAllBookmarksListOptions] =
    React.useState("");

  function setListOptionsState() {
    fetch("/user_bookmarks_lists.json").then((response) =>
      response.json().then((jsonResponse) => {
        const bookmarksLists = jsonResponse.bookmarksLists;
        const allListOptions = [];

        bookmarksLists.map((bookmarksList) => {
          let hikeOnList = false;
          for (const hike of bookmarksList.hikes) {
            if (hike.hike_id === Number(hike_id)) {
              hikeOnList = true;
            }
          }

          if (hikeOnList) {
            allListOptions.push({
              select: true,
              bookmarks_list_name: bookmarksList.bookmarks_list_name,
              bookmarks_list_id: bookmarksList.bookmarks_list_id,
            });
          } else {
            allListOptions.push({
              select: false,
              bookmarks_list_name: bookmarksList.bookmarks_list_name,
              bookmarks_list_id: bookmarksList.bookmarks_list_id,
            });
          }
        });
        setAllBookmarksListOptions(allListOptions);
      })
    );
  }

  if (session_login === "True") {
    React.useEffect(() => {
      setListOptionsState();
    }, []);
  }

  console.log("allBookmarksListOptions", allBookmarksListOptions);

  function addHikeExistingBookmarksList() {
    fetch(`/hikes/${hike_id}/add-hike-to-existing-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        allBookmarksListOptions, // returns list of objects
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        setListOptionsState();
        props.getBookmarksLists();
        console.log(jsonResponse);
      });
    });
  }

  // For adding to new list
  const [bookmarksListName, setBookmarksListName] = React.useState("");

  function addHikeNewBookmarksList() {
    fetch(`/hikes/${hike_id}/add-hike-to-new-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        bookmarksListName,
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        setListOptionsState();
        props.getBookmarksLists();
        console.log(jsonResponse);
      });
    });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id="modal-add-bookmark"
        tabIndex="-1"
        aria-labelledby="modal-add-bookmark-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-add-bookmark-label">
                Bookmark this hike
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {session_login !== "True" ? (
                <div>Please log in to add a bookmark.</div>
              ) : (
                <div>
                  <h4>Add to New Bookmark List</h4>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Hikes I Want To Visit"
                      value={bookmarksListName}
                      onChange={(event) =>
                        setBookmarksListName(event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <button
                      className="btn btn-sm btn-outline-dark btn-block"
                      type="submit"
                      data-bs-dismiss="modal"
                      onClick={addHikeNewBookmarksList}
                    >
                      Save
                    </button>
                  </div>

                  <h4>Add to Existing Bookmark List</h4>

                  <div className="mb-3">
                    {allBookmarksListOptions !== ""
                      ? allBookmarksListOptions.map((bookmarksListOption) => (
                          <div
                            className="form-check"
                            key={`${props.hike_id}-${bookmarksListOption.bookmarks_list_id}`}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`add-hike-${bookmarksListOption.bookmarks_list_id}`}
                              value={bookmarksListOption.bookmarks_list_id}
                              checked={bookmarksListOption.select}
                              onChange={(event) => {
                                event.stopPropagation();
                                let checked = event.target.checked;
                                setAllBookmarksListOptions(
                                  allBookmarksListOptions.map((data) => {
                                    if (
                                      bookmarksListOption.bookmarks_list_id ===
                                      data.bookmarks_list_id
                                    ) {
                                      data.select = checked;
                                    }
                                    return data;
                                  })
                                );
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`add-hike-${bookmarksListOption.bookmarks_list_id}`}
                            >
                              {bookmarksListOption.bookmarks_list_name}
                            </label>
                          </div>
                        ))
                      : null}
                  </div>

                  <div className="mb-3">
                    <button
                      className="btn btn-sm btn-outline-dark btn-block"
                      type="submit"
                      data-bs-dismiss="modal"
                      onClick={addHikeExistingBookmarksList}
                    >
                      Save
                    </button>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary btn-block"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// Bookmarks Lists Container Component
function HikeDetailsBookmarksListContainer() {
  const session_login = document.querySelector("#login").innerText;
  const [bookmarksLists, setBookmarksLists] = React.useState([]);
  const [bookmarksListsHeader, setBookmarksListsHeader] = React.useState(
    "Bookmarks For This Hike"
  );
  const hike_id = document.querySelector("#hike_id").innerText;

  function getBookmarksLists() {
    if (
      document.querySelector("#BookmarksLabel").innerText ===
      "Bookmarks For This Hike"
    ) {
      getHikeBookmarksLists();
    } else if (
      document.querySelector("#BookmarksLabel").innerText === "All Bookmarks"
    ) {
      getUserBookmarksLists();
    }
  }

  function getHikeBookmarksLists() {
    fetch(`/hikes/${hike_id}/bookmarks.json`)
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
        setBookmarksListsHeader("Bookmarks For This Hike");
      });
  }

  function getUserBookmarksLists() {
    fetch("/user_bookmarks_lists.json")
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
        setBookmarksListsHeader("All Bookmarks");
      });
  }

  if (session_login === "True") {
    React.useEffect(() => {
      getHikeBookmarksLists();
    }, []);
  }

  const allBookmarksLists = [];
  const allRenameBookmarksLists = [];
  const allAddHikesToBookmarks = [];

  // the following line will print out the value of cards
  // pay attention to what it is initially and what it is when the component re-renders
  console.log(`bookmarksLists: `, bookmarksLists);

  for (const currentBookmarksList of bookmarksLists) {
    allBookmarksLists.push(
      <BookmarksList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        hikes={currentBookmarksList.hikes}
        getBookmarksLists={getBookmarksLists}
      />
    );

    // allAddHikesToBookmarks.push(
    //   <AddHikesToBookmarksList
    //     key={currentBookmarksList.bookmarks_list_id}
    //     bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
    //     bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
    //     hikes={currentBookmarksList.hikes}
    //     getBookmarksLists={getBookmarksLists}
    //   />
    // );

    allRenameBookmarksLists.push(
      <RenameBookmarksList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        getBookmarksLists={getBookmarksLists}
      />
    );
  }

  return (
    <React.Fragment>
      <CreateBookmarksList getBookmarksLists={getBookmarksLists} />
      <AddCurrentHikeToBookmarksList getBookmarksLists={getBookmarksLists} />
      {allRenameBookmarksLists}
      {/* {allAddHikesToBookmarks} */}
      <div
        className="offcanvas offcanvas-end"
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="Bookmarks"
        aria-labelledby="BookmarksLabel"
        style={{ width: "750px" }}
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="BookmarksLabel">
            {bookmarksListsHeader}
          </h3>
          {session_login === "True" ? (
            <div className="d-flex float-end">
              <div className="btn-group mt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  actions <i className="bi bi-bookmark-star"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      href=""
                      data-bs-toggle="modal"
                      data-bs-target="#modal-create-bookmarks-list"
                    >
                      create a list
                    </a>
                  </li>
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      href=""
                      data-bs-toggle="modal"
                      data-bs-target="#modal-add-bookmark"
                      // onClick={setListOptionsState}
                    >
                      bookmark this hike
                    </a>
                  </li>
                </ul>
              </div>
              &nbsp;&nbsp;
              <div className="btn-group mt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  view <i className="bi bi-eye"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      onClick={getUserBookmarksLists}
                    >
                      view all lists
                    </a>
                  </li>
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      onClick={getHikeBookmarksLists}
                    >
                      view lists for this hike
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {session_login === "True" &&
        bookmarksListsHeader === "Bookmarks For This Hike" ? (
          <div className="ms-4">You have this hike on the following lists:</div>
        ) : null}
        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div>Please log in to add a bookmark.</div>
          ) : (
            <React.Fragment>
              <div>{allBookmarksLists}</div>
            </React.Fragment>
          )}
          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              right: "705px",
              bottom: "1em",
              zIndex: "100",
            }}
          >
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
