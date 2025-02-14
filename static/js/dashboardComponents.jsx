"use strict";

const Footer = () => {
  const session_login = document.querySelector("#login").innerText;
  return (
    <React.Fragment>
      <nav
        className="footer-menu navbar navbar-expand-sm navbar-light bg-light fixed-bottom"
        style={{ border: "1px solid #ced4da" }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <FooterSearchBar />

            <div className="d-flex"></div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

const ViewMonthYear = (props) => {
  const [yearOptions, setYearOptions] = React.useState([]);
  const monthOptions = [
    { monthNum: 1, monthAbbr: "Jan" },
    { monthNum: 2, monthAbbr: "Feb" },
    { monthNum: 3, monthAbbr: "Mar" },
    { monthNum: 4, monthAbbr: "Apr" },
    { monthNum: 5, monthAbbr: "May" },
    { monthNum: 6, monthAbbr: "Jun" },
    { monthNum: 7, monthAbbr: "Jul" },
    { monthNum: 8, monthAbbr: "Aug" },
    { monthNum: 9, monthAbbr: "Sep" },
    { monthNum: 10, monthAbbr: "Oct" },
    { monthNum: 11, monthAbbr: "Nov" },
    { monthNum: 12, monthAbbr: "Dec" },
  ];

  React.useEffect(() => {
    getYearOptions();
  }, []);

  const getYearOptions = () => {
    fetch("/user_check_ins.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { checkIns } = jsonResponse;
        let years = [];
        for (const checkIn of checkIns) {
          const dateHiked = new Date(checkIn.date_hiked);
          const year = dateHiked.getFullYear();
          if (!years.includes(year)) {
            years.push(year);
          }
        }
        setYearOptions(
          years.sort((a, b) => {
            return b - a;
          })
        );
      });
  };

  const changeMonthYearForm = () => {
    getYearOptions();
    if (document.getElementById(`${props.category}-month-view`).checked) {
      document.getElementById(
        `${props.category}-show-month-view`
      ).style.display = "block";
      document.getElementById(
        `${props.category}-show-year-view`
      ).style.display = "none";
      document.getElementById(`${props.category}-show-all-view`).style.display =
        "none";
    } else if (document.getElementById(`${props.category}-year-view`).checked) {
      document.getElementById(
        `${props.category}-show-month-view`
      ).style.display = "none";
      document.getElementById(
        `${props.category}-show-year-view`
      ).style.display = "block";
      document.getElementById(`${props.category}-show-all-view`).style.display =
        "none";
    } else if (document.getElementById(`${props.category}-all-view`).checked) {
      document.getElementById(
        `${props.category}-show-month-view`
      ).style.display = "none";
      document.getElementById(
        `${props.category}-show-year-view`
      ).style.display = "none";
      document.getElementById(`${props.category}-show-all-view`).style.display =
        "block";
    }
  };

  return (
    <div>
      <div className="row fw-300">
        <div className="d-flex">
          <div className="mt-1">View by&nbsp;&nbsp;</div>
          <input
            type="radio"
            className="btn-check"
            name={`${props.category}-view`}
            value={`${props.category}-month-view`}
            id={`${props.category}-month-view`}
            autocomplete="off"
            onClick={changeMonthYearForm}
          />
          <label
            className="btn btn-outline-dark btn-sm fw-300"
            for={`${props.category}-month-view`}
          >
            month
          </label>
          &nbsp;
          <input
            type="radio"
            className="btn-check"
            name={`${props.category}-view`}
            value={`${props.category}-year-view`}
            id={`${props.category}-year-view`}
            autocomplete="off"
            onClick={changeMonthYearForm}
          />
          <label
            className="btn btn-outline-dark btn-sm fw-300"
            for={`${props.category}-year-view`}
          >
            year
          </label>
          &nbsp;
          <div>
            <input
              type="radio"
              className="btn-check"
              name={`${props.category}-view`}
              value={`${props.category}-all-view`}
              id={`${props.category}-all-view`}
              autocomplete="off"
              onClick={changeMonthYearForm}
            />
            <label
              className="btn btn-outline-dark btn-sm fw-300"
              for={`${props.category}-all-view`}
            >
              all time
            </label>
          </div>
        </div>
      </div>
      <div
        id={`${props.category}-show-month-view`}
        className="mt-1 map-form"
        style={{ display: "none" }}
      >
        <div className="d-flex">
          <div>
            <select
              className="form-select btn-sm fw-300"
              name={`${props.category}-month-view-month`}
              aria-label={`${props.category}-month-view-select-month`}
              style={{ width: "5em" }}
            >
              {monthOptions.map((month) => (
                <option
                  key={`${props.category}-month-${month.monthNum}`}
                  value={month.monthNum}
                >
                  {month.monthAbbr}
                </option>
              ))}
            </select>
          </div>
          &nbsp;
          <div>
            <select
              className="form-select btn-sm fw-300"
              name={`${props.category}-month-view-year`}
              aria-label={`${props.category}-month-view-select-year`}
              style={{ width: "6em" }}
            >
              {yearOptions.map((year) => (
                <option value={year}>{year}</option>
              ))}
            </select>
          </div>
          &nbsp;
          <button
            className={`${props.category}-view-submit btn btn-sm btn-outline-dark fw-300`}
            type="submit"
            name="view"
            value="month"
            onClick={props.getFunction}
          >
            Submit
          </button>
        </div>
      </div>
      <div
        id={`${props.category}-show-year-view`}
        className="mt-1 map-form"
        style={{ display: "none" }}
      >
        <div className="d-flex">
          <div>
            <select
              className="form-select btn-sm fw-300"
              name={`${props.category}-year-view-year`}
              aria-label={`${props.category}-year-view-select-year`}
              style={{ width: "6em" }}
            >
              {yearOptions.map((year) => (
                <option value={year}>{year}</option>
              ))}
            </select>
          </div>
          &nbsp;
          <button
            className={`${props.category}-view-submit btn btn-sm btn-outline-dark fw-300`}
            type="submit"
            name="view"
            value="year"
            onClick={props.getFunction}
          >
            Submit
          </button>
        </div>
      </div>
      <div
        id={`${props.category}-show-all-view`}
        className="mt-1 map-form"
        style={{ display: "none" }}
      >
        <div className="d-flex">
          <button
            className={`${props.category}-view-submit btn btn-sm btn-outline-dark`}
            type="submit"
            name="view"
            value="all"
            onClick={props.getFunction}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardHeader = (props) => {
  return (
    <div className="clearfix" style={{ width: "100%" }}>
      <h3 className="float-start" id={props.headerLabel}>
        {props.title}
      </h3>
      <div className="float-end">
        <a
          className="btn btn-sm btn-outline-dark"
          href=""
          data-bs-toggle="modal"
          data-bs-target={props.modalTarget}
        >
          <i className={props.icon}></i> {props.modalText}
        </a>
      </div>
    </div>
  );
};

const DashboardMainContainer = React.forwardRef((props, ref) => {
  const BookmarksListRef = React.useRef();
  const AddMultHikesToExistingListRef = React.useRef();
  const DashboardGraphContainerRef = React.useRef();
  const DashboardMapContainerRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    displayMap() {
      document.getElementById("display-map").style.display = "block";
      document.getElementById("display-graph").style.display = "none";
      document.getElementById("display-check-ins").style.display = "none";
      document.getElementById("display-bookmarks").style.display = "none";
      document.getElementById("display-comments").style.display = "none";
    },
    displayGraph() {
      document.getElementById("display-map").style.display = "none";
      document.getElementById("display-graph").style.display = "block";
      document.getElementById("display-check-ins").style.display = "none";
      document.getElementById("display-bookmarks").style.display = "none";
      document.getElementById("display-comments").style.display = "none";
    },
    displayCheckIns() {
      document.getElementById("display-map").style.display = "none";
      document.getElementById("display-graph").style.display = "none";
      document.getElementById("display-check-ins").style.display = "block";
      document.getElementById("display-bookmarks").style.display = "none";
      document.getElementById("display-comments").style.display = "none";
    },
    displayBookmarks() {
      document.getElementById("display-map").style.display = "none";
      document.getElementById("display-graph").style.display = "none";
      document.getElementById("display-check-ins").style.display = "none";
      document.getElementById("display-bookmarks").style.display = "block";
      document.getElementById("display-comments").style.display = "none";
    },
    displayComments() {
      document.getElementById("display-map").style.display = "none";
      document.getElementById("display-graph").style.display = "none";
      document.getElementById("display-check-ins").style.display = "none";
      document.getElementById("display-bookmarks").style.display = "none";
      document.getElementById("display-comments").style.display = "block";
    },
  }));

  const [checkIns, setCheckIns] = React.useState([]);
  const [bookmarksLists, setBookmarksLists] = React.useState([]);
  const [comments, setComments] = React.useState([]);
  const [errorCheckIns, setErrorCheckIns] = React.useState(null);
  const [isLoadedCheckIns, setIsLoadedCheckIns] = React.useState(false);
  const [errorBookmarksLists, setErrorBookmarksLists] = React.useState(null);
  const [isLoadedBookmarksLists, setIsLoadedBookmarksLists] =
    React.useState(false);
  const [errorComments, setErrorComments] = React.useState(null);
  const [isLoadedComments, setIsLoadedComments] = React.useState(false);

  const refreshProfiles = () => {
    props.parentGetPetProfiles();
  };

  React.useEffect(() => {
    getCheckIns();
    getBookmarksLists();
    getComments();
  }, []);

  const getCheckIns = () => {
    fetch("/user_check_ins.json")
      .then((response) => response.json())
      .then(
        (data) => {
          setCheckIns(data.checkIns);
          setIsLoadedCheckIns(true);
        },
        (error) => {
          setIsLoadedCheckIns(true);
          setErrorCheckIns(error);
        }
      );
  };

  const getBookmarksLists = () => {
    fetch("/user_bookmarks_lists.json")
      .then((response) => response.json())
      .then(
        (data) => {
          setBookmarksLists(data.bookmarksLists);
          setIsLoadedBookmarksLists(true);
        },
        (error) => {
          setIsLoadedBookmarksLists(true);
          setErrorBookmarksLists(error);
        }
      );
  };

  const getComments = () => {
    fetch("/user_comments.json")
      .then((response) => response.json())
      .then(
        (data) => {
          setComments(data.comments);
          setIsLoadedComments(true);
        },
        (error) => {
          setIsLoadedComments(true);
          setErrorComments(error);
        }
      );
  };

  const parentGetGraphData = () => {
    // When a check in is added, edited, deleted, update graph data
    DashboardGraphContainerRef.current.updateGraphData();
  };

  const parentGetMapData = () => {
    DashboardMapContainerRef.current.getMapData();
  };

  const allCheckIns = [];
  const allEditCheckIns = [];

  const allBookmarksLists = [];
  const allRenameBookmarksLists = [];
  const allAddMultHikesToExistingList = [];

  for (const currentCheckIn of checkIns) {
    const date_hiked = new Date(currentCheckIn.date_hiked);
    const date_hiked_formatted = date_hiked.toLocaleDateString();

    allCheckIns.push(
      <CheckIn
        key={currentCheckIn.check_in_id}
        hike_id={currentCheckIn.hike_id}
        hike_name={currentCheckIn.hike["hike_name"]}
        check_in_id={currentCheckIn.check_in_id}
        date_hiked={date_hiked_formatted}
        miles_completed={currentCheckIn.miles_completed}
        total_time={currentCheckIn.total_time}
        notes={currentCheckIn.notes}
        pets_on_hike={currentCheckIn.pets}
        pets_not_on_hike={currentCheckIn.pets_not_on_hike}
        getCheckIns={getCheckIns}
        refreshProfiles={refreshProfiles}
        parentGetMapData={parentGetMapData}
        parentGetGraphData={parentGetGraphData}
      />
    );
    allEditCheckIns.push(
      <EditCheckIn
        key={currentCheckIn.check_in_id}
        hike_id={currentCheckIn.hike_id}
        check_in_id={currentCheckIn.check_in_id}
        date_hiked={date_hiked_formatted}
        miles_completed={currentCheckIn.miles_completed}
        total_time={currentCheckIn.total_time}
        notes={currentCheckIn.notes}
        pets_on_hike={currentCheckIn.pets}
        pets_not_on_hike={currentCheckIn.pets_not_on_hike}
        getCheckIns={getCheckIns}
        refreshProfiles={refreshProfiles}
        parentGetMapData={parentGetMapData}
        parentGetGraphData={parentGetGraphData}
      />
    );
  }

  const timestamp = Date.now();

  for (const currentBookmarksList of bookmarksLists) {
    allBookmarksLists.push(
      <BookmarksList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        hikes={currentBookmarksList.hikes}
        getBookmarksLists={getBookmarksLists}
        ref={BookmarksListRef}
      />
    );

    allAddMultHikesToExistingList.push(
      <AddMultHikesToExistingList
        key={`${timestamp}-${currentBookmarksList.bookmarks_list_id}`}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        hikes={currentBookmarksList.hikes}
        getBookmarksLists={getBookmarksLists}
        ref={AddMultHikesToExistingListRef}
      />
    );

    allRenameBookmarksLists.push(
      <RenameBookmarksList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        getBookmarksLists={getBookmarksLists}
      />
    );
  }

  const allComments = [];
  const allEditComments = [];

  for (const currentComment of comments) {
    const date_edited = new Date(currentComment.date_edited);
    const date_edited_formatted = `${date_edited.toLocaleDateString()} ${date_edited.toLocaleTimeString()}`;
    const date_created = new Date(currentComment.date_created);
    const date_created_formatted = `${date_created.toLocaleDateString()} ${date_created.toLocaleTimeString()}`;

    allComments.push(
      <Comment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        hike_name={currentComment.hike.hike_name}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        getComments={getComments}
      />
    );

    allEditComments.push(
      <EditComment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        getComments={getComments}
      />
    );
  }

  return (
    <React.Fragment>
      <AddComment getComments={getComments} />
      <AddCheckIn
        getCheckIns={getCheckIns}
        refreshProfiles={refreshProfiles}
        parentGetMapData={parentGetMapData}
        parentGetGraphData={parentGetGraphData}
      />
      {allEditComments}
      {allEditCheckIns}
      {allRenameBookmarksLists}
      {allAddMultHikesToExistingList}
      <CreateBookmarksList getBookmarksLists={getBookmarksLists} />
      <div className="dashboard-container d-flex flex-column flex-shrink-0">
        <div className="dashboard-display pt-1 pe-1" id="display-map">
          <DashboardHeader
            headerLabel="MapLabel"
            title="Where We've Been 🗺"
            modalTarget="#modal-add-check-in"
            icon="bi bi-check-circle"
            modalText="add a check in"
          />
          <DashboardMapContainer ref={DashboardMapContainerRef} />
        </div>
        <div
          className="dashboard-display pt-1 pe-1"
          id="display-graph"
          style={{ display: "none" }}
        >
          <DashboardHeader
            headerLabel="GraphLabel"
            title="How Far We've Traveled 🐾"
            modalTarget="#modal-add-check-in"
            icon="bi bi-check-circle"
            modalText="add a check in"
          />
          <DashboardGraphContainer ref={DashboardGraphContainerRef} />
        </div>

        <div
          className="dashboard-display pt-1 pe-1"
          id="display-check-ins"
          style={{ display: "none" }}
        >
          <DashboardHeader
            headerLabel="CheckInsLabel"
            title="Check Ins"
            modalTarget="#modal-add-check-in"
            icon="bi bi-check-circle"
            modalText="add a check in"
          />

          <div style={{ height: "calc(100% - 50px)", overflowY: "auto" }}>
            {errorCheckIns ? (
              <i>{errorCheckIns.message}</i>
            ) : !isLoadedCheckIns ? (
              <div class="loading-container">
                <div class="loading"></div>
                <div id="loading-text">loading</div>
              </div>
            ) : allCheckIns.length > 0 ? (
              <React.Fragment>{allCheckIns}</React.Fragment>
            ) : (
              <React.Fragment>
                <div className="fw-300">
                  You haven't checked into any hikes yet!
                  <br></br>Please add a check in to view your stats.
                </div>
              </React.Fragment>
            )}
          </div>
        </div>

        <div
          className="dashboard-display pt-1 pe-1"
          id="display-bookmarks"
          style={{ display: "none" }}
        >
          <DashboardHeader
            headerLabel="BookmarksLabel"
            title="Bookmarks"
            modalTarget="#modal-create-bookmarks-list"
            icon="bi bi-bookmark-star"
            modalText="create a list"
          />
          <div style={{ height: "calc(100% - 50px)", overflowY: "auto" }}>
            {errorBookmarksLists ? (
              <i>{errorBookmarksLists.message}</i>
            ) : !isLoadedBookmarksLists ? (
              <div class="loading-container">
                <div class="loading"></div>
                <div id="loading-text">loading</div>
              </div>
            ) : allBookmarksLists.length > 0 ? (
              <React.Fragment>{allBookmarksLists}</React.Fragment>
            ) : (
              <React.Fragment>
                <div className="fw-300">
                  You haven't added any bookmarks yet!
                  <br></br>Please add a bookmark to view your bookmarks.
                </div>
              </React.Fragment>
            )}
          </div>
        </div>

        <div
          className="dashboard-display pt-1 pe-1"
          id="display-comments"
          style={{ display: "none" }}
        >
          <DashboardHeader
            headerLabel="CommentsLabel"
            title="Comments"
            modalTarget="#modal-add-comment"
            icon="bi bi-chat-text"
            modalText="add a comment"
          />
          <div style={{ height: "calc(100% - 50px)", overflowY: "auto" }}>
            {errorComments ? (
              <i>{errorComments.message}</i>
            ) : !isLoadedComments ? (
              <div class="loading-container">
                <div class="loading"></div>
                <div id="loading-text">loading</div>
              </div>
            ) : allComments.length > 0 ? (
              <React.Fragment>{allComments}</React.Fragment>
            ) : (
              <React.Fragment>
                <div className="fw-300">
                  You haven't added any comments yet!
                  <br></br>Please add a comment to view your comments.
                </div>
              </React.Fragment>
            )}
          </div>

          <div style={{ height: "100%", overflowY: "auto" }}>{allComments}</div>
        </div>
      </div>
    </React.Fragment>
  );
});

const SideBarMenu = (props) => {
  return (
    <React.Fragment>
      <div className="side-bar-menu d-flex flex-column flex-shrink-0 bg-light">
        <ul className="sidebar-ul nav nav-pills nav-flush flex-column mb-auto text-center">
          <li>
            <a
              href="#"
              className="btn btn-light sidebar-btn"
              title="Where We've Been"
              data-bs-custom-className="custom-tooltip"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayMap}
              style={{ marginTop: "50px" }}
            >
              <i className="sidebar-icon bi bi-geo"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="btn btn-light sidebar-btn"
              title="How Far We've Traveled"
              data-bs-custom-className="custom-tooltip"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayGraph}
            >
              <i className="sidebar-icon bi bi-graph-up"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="btn btn-light sidebar-btn"
              title="Check Ins"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayCheckIns}
            >
              <i className="sidebar-icon bi bi-check-circle"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="btn btn-light sidebar-btn"
              title="Bookmarks"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayBookmarks}
            >
              <i className="sidebar-icon bi bi-bookmark-star"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="btn btn-light sidebar-btn"
              title="Comments"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayComments}
            >
              <i className="sidebar-icon bi bi-chat-text"></i>
            </a>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

const DashboardEverythingContainer = () => {
  const DashboardMainContainerRef = React.useRef();
  const DashboardPetProfileContainerRef = React.useRef();

  const parentGetPetProfiles = () => {
    DashboardPetProfileContainerRef.current.getPetProfiles();
  };

  const parentDisplayMap = () => {
    DashboardMainContainerRef.current.displayMap();
  };
  const parentDisplayGraph = () => {
    DashboardMainContainerRef.current.displayGraph();
  };
  const parentDisplayCheckIns = () => {
    DashboardMainContainerRef.current.displayCheckIns();
  };
  const parentDisplayBookmarks = () => {
    DashboardMainContainerRef.current.displayBookmarks();
  };
  const parentDisplayComments = () => {
    DashboardMainContainerRef.current.displayComments();
  };

  return (
    <React.Fragment>
      <DashboardMainContainer
        parentGetPetProfiles={parentGetPetProfiles}
        ref={DashboardMainContainerRef}
      />
      <SideBarMenu
        parentDisplayMap={parentDisplayMap}
        parentDisplayGraph={parentDisplayGraph}
        parentDisplayCheckIns={parentDisplayCheckIns}
        parentDisplayBookmarks={parentDisplayBookmarks}
        parentDisplayComments={parentDisplayComments}
      />
      <SearchOffCanvas />
      <DashboardPetProfileContainer ref={DashboardPetProfileContainerRef} />
      {/* <Footer /> */}
    </React.Fragment>
  );
};

ReactDOM.render(
  <DashboardEverythingContainer />,
  document.getElementById("root")
);
