import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { getCommentData } from '../../../fetch/detail/detail'

import ListComponent from '../../../components/CommentList'
import LoadMore from '../../../components/LoadMore'

import './style.less'

class Comment extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: [],
            hasMore: false,
            isLoadingMore: false,
            page: 0
        }
    }

    render() {
        return (
            <div className='detail-comment-subpage'>
                <h2>Customer Comment</h2>
                {
                    this.state.data.length
                    ? <ListComponent data={this.state.data}/>
                    : <div>{/* loading... */}</div>
                }
                {
                    this.state.hasMore
                    ? <LoadMore isLoadingMore={this.state.isLoadingMore} loadMoreFn={this.loadMoreData.bind(this)}/>
                    : ''
                }
            </div>
        )
    }

    componentDidMount() {
        this.loadFirstPageData();
    }

    // Get first page data
    loadFirstPageData() {
        const id = this.props.id
        const result = getCommentData(0, id)
        this.resultHandle(result)
    }

    // load more data
    loadMoreData() {
        // record state
        this.setState({
            isLoadingMore: true
        })

        const id = this.props.id
        const page = this.state.page
        const result = getCommentData(page, id)
        this.resultHandle(result)

        this.setState({
            isLoadingMore: false
        })
    }

    // handle data
    resultHandle(result) {
        result.then(res => {
            return res.json()
        }).then(json => {
            const page = this.state.page
            this.setState({
                page: page + 1
            })

            const hasMore = json.hasMore
            const data = json.data
            this.setState({
                hasMore: hasMore,
                // remain previous data
                data: this.state.data.concat(data)
            })
        }).catch(ex => {
            if (__DEV__) {
                console.log('get data from user comment error, ', ex.message)
            }
        })
    }
}

export default Comment