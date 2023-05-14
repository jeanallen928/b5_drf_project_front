export const BACK_BASE_URL = "http://127.0.0.1:8000"
export const FRONT_BASE_URL = "http://127.0.0.1:5500"
const token = localStorage.getItem('access')

// #################### 게시글 리스트 ####################

// 게시글 리스트 GET 요청
export async function getPostings(POSTING_ID = null) {
    if (POSTING_ID == null) {
        const url = `${BACK_BASE_URL}/posting/`
        const response = await fetch(url, {
            method: 'GET'
        })

        if (response.status == 200) {
            const response_json = await response.json()
            return response_json
        } else {
            console.log("잠시 후 다시 시도해주세요")
        }
    }
}

// 게시글 목록 보여주기 
export async function viewPostingList() {
    const postings = await getPostings()
    postings.forEach(posting => {
        const template = document.createElement("div");
        template.setAttribute("class", "gw-posting-each")
        console.log(posting.id)
        template.innerHTML = `<div class="row" data-posting-id="${posting.id}">
                                <div class="gw-click" onclick="postingDetail(${posting.id})" style="width: 100%;">
                                    <div style="display: flex;">
                                        <h3 class="gw-post-title">${posting.title}</h3>
                                    </div>
                                    <div class="gw-post-content">${posting.content}</div>
                                </div>
                                <div style="display: flex;">
                                    <div style="margin-right: 10px;">
                                        <img class="gw-main-writer-image" src="${posting.user_image}" alt="">
                                    </div>
                                    <div class="gw-post-writer">${posting.username}</div>
                                </div>
                                <div class="gw-main-comments-count">댓글 ${posting.comment_count}</div>
                                <div style="margin: 0 5% 0 0;">
                                    <object class="like-icon" data="assets/css/images/heart.svg" type="image/svg+xml"></object>
                                    <span class="gw-post-likes">${posting.like_count}</span>
                                </div>
                                </div>`
        const posting_list = document.getElementById("gw-container")
        posting_list.appendChild(template)

        /* 이미지 있을때, 이미지 태그 오른쪽으로 띄워주기위한 속성 설정 */
        const images = document.querySelectorAll(".gw-post-content p img")
        if (images != null) {
            for (let i = 0; i < images.length; i++) {
                images[i].setAttribute("class", "gw-summer-image")
                images[i].style.removeProperty("width");
            }
        }
        /* 게시글 미리보기 엔터 연타 방지 */
        const pTags = document.querySelectorAll('p');
        for (let i = 0; i < pTags.length; i++) {
            if (pTags[i].childElementCount === 0) {
                pTags[i].parentNode.removeChild(pTags[i]);
            }
        }
        /* 이미지 여러개 시 썸네일 1개만 표시하기? */
        console.log(images)
    });
}

// 게시글 작성 POST 요청
export async function writePosting() {
    const gwTitle = document.getElementById('gwTitle').value;
    const summernote = $('#summernote').summernote('code');

    const formdata = new FormData();
    formdata.append('title', gwTitle);
    formdata.append('content', summernote);

    /* value 확인하기 */
    for (let value of formdata.values()) {
        console.log(value);
    }

    const url = `${BACK_BASE_URL}/posting/`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formdata
    })

    if (response.status == 201) {
        alert("작성 완료");
        window.location.replace(`${FRONT_BASE_URL}/community-main.html`);
    }
}

// 게시글 목록에서 클릭 시 상세페이지로 가기
window.postingDetail = function (POSTING_ID) {
    window.location.href = `${FRONT_BASE_URL}/community-detail.html?posting_id=${POSTING_ID}`
    console.log(POSTING_ID)
}

// #################### 게시글 상세 ####################

// 게시글 상세 페이지 데이터 GET 요청 (유저 정보 포함)
export async function getPostingDetail(POSTING_ID) {
    // console.log(POSTING_ID)
    const url = `${BACK_BASE_URL}/posting/${POSTING_ID}/`
    const response = await fetch(url, {
        method: 'GET'
    })
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        console.log("잠시 후 다시 시도해주세요")
    }
}

// 게시글 상세 페이지 보여주기
export async function viewPostingDetail(posting) {
    // console.log(posting)

    /* 게시글 */
    const title = document.getElementById('gw-title');
    title.innerHTML = posting.title;

    const content = document.getElementById('gw-content');
    content.innerHTML = posting.content;

    const updatedAt = document.getElementById('gw-created');
    updatedAt.innerHTML = posting.updated_at;

    const isUpdated = document.getElementById('gw-is-updated');
    const a = posting.is_updated ? "수정일" : "작성일";
    isUpdated.innerHTML = a

    const likeCount = document.getElementById('gw-like');
    likeCount.innerHTML = posting.like_count;

    /* 작성자 */
    const writer = document.querySelectorAll('.gw-writer')
    writer.forEach(name => {
        name.innerHTML = posting.username;
    });

    const writerImages = document.querySelectorAll('.gw-w-img');
    writerImages.forEach(image => {
        image.src = posting.user_image;
    });

    const following = document.getElementById('gw-b-following')
    following.innerHTML = posting.followings_count

    const follower = document.getElementById('gw-b-follower')
    follower.innerHTML = posting.followers_count

    const introduction = document.getElementById('gw-banner-bio')
    introduction.innerHTML = posting.introduction

    const userId = document.getElementById('gw-writer-image')
    userId.setAttribute('data-user-id', posting.user_id);
}

// 서버에 GET요청으로 데이터 받아오기(게시글 수정용)
export async function getEditPosting() {
    const POSTING_ID = new URLSearchParams(window.location.search).get("posting_id");

    const url = `${BACK_BASE_URL}/posting/${POSTING_ID}/`
    const response = await fetch(url, {
        method: 'GET'
    })
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        console.log("잠시 후 다시 시도해주세요")
    }

}

// 게시글 수정 PUT 요청
export async function updatePosting() {
    const POSTING_ID = new URLSearchParams(window.location.search).get("posting_id");
    const gwTitle = document.getElementById('gwTitle').value;
    const summernote = $('#summernote').summernote('code');

    const formdata = new FormData();
    formdata.append('title', gwTitle);
    formdata.append('content', summernote);

    /* value 확인하기 
    for (let value of formdata.values()) {
        console.log(value);
    }*/

    const url = `${BACK_BASE_URL}/posting/${POSTING_ID}/`
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formdata
    })

    if (response.status == 200) {
        alert("수정 완료");
        window.location.replace(`${FRONT_BASE_URL}/community-detail.html?posting_id=${POSTING_ID}`);
    }
}

// 게시글 삭제 DELETE 요청
export async function DeletePosting(POSTING_ID) {
    // console.log(POSTING_ID)
    try {
        const confirmed = confirm("정말 삭제할까요?");

        if (confirmed) {
            const url = `${BACK_BASE_URL}/posting/${POSTING_ID}/`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                method: "DELETE"
            });

            if (response.status == 204) {
                window.location.href = `${FRONT_BASE_URL}/community-main.html`;
            } else {
                console.error("삭제에 실패했습니다!");
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// #################### 게시글 댓글 ####################

// 댓글 목록 GET 요청
export async function getPostingComment(POSTING_ID) {
    // console.log(POSTING_ID)
    const url = `${BACK_BASE_URL}/posting/${POSTING_ID}/comment/`
    const response = await fetch(url, {
        method: 'GET'
    })
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        console.log("잠시 후 다시 시도해주세요")
    }
}

// 댓글 작성 POST 요청
export async function writeComment(POSTING_ID) {
    const url = `${BACK_BASE_URL}/posting/${POSTING_ID}/comment/`;
    const content = document.getElementById('post-comment').value;
    console.log(content)

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            'content': content
        })
    })
    if (response.status == 201) {
        alert("작성 완료");
        window.location.reload()
    }
}

// 댓글 목록 보여주기
export async function viewPostingComment() {
    const urlParams = new URLSearchParams(window.location.search);
    const POSITING_ID = urlParams.get('posting_id');
    const comments = await getPostingComment(POSITING_ID)

    comments.forEach(comment => {
        const template = document.createElement("div");
        template.setAttribute("class", "gw-comment")
        template.innerHTML = `  <div class="gw-comment-writer">
                                    <img class="comment-image" src="${comment.image}" alt="">
                                    <div class="comment-writer">${comment.username}</div>
                                    <div style="display: flex; margin:auto 0 auto auto">
                                        <button class="gw-btn-comment gw-btn-nocolor">수정</button>
                                        <button class="gw-btn-comment gw-btn-nocolor">삭제</button>
                                    </div>
                                </div>
                                <div class="gw-comment-content"
                                    style="background-color:rgb(228, 228, 228); padding: 2%; border-radius: 10px;">
                                    <div style="width: 90%;">${comment.content}
                                    </div>
                                </div>`
        const comment_list = document.getElementById("gw-comment-list")
        comment_list.appendChild(template)
        console.log(comment)
    })
}