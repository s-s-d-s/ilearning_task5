import React, {useState, useEffect, useContext} from 'react'
import { useMessage } from "../hooks/message.hook"
import { useHttp } from "../hooks/http.hook"
import { getUsers } from "../hooks/get.users.hook"
import { DataGrid } from '@material-ui/data-grid'
import { AuthContext } from "../context/AuthContext"
import moment from 'moment'

export const TablePage = () => {
    const { loading, request } = useHttp()
    const message = useMessage()
    const [rows, setRows] = useState([])
    const [selectionModel, setSelectionModel] = useState([])
    const auth = useContext(AuthContext)

    const blockHandler = async () => {
        try {
            const data = await request('/block', 'POST', selectionModel)
            message(data.message)
        } catch (e) {}
    }

    const unblockHandler = async () => {
        try {
            const data = await request('/unblock', 'POST', selectionModel)
            message(data.message)
        } catch (e) {}
    }

    const deleteHandler = async () => {
        try {
            const data = await request('/delete', 'POST', selectionModel)
            message(data.message)
        } catch (e) {}
    }

    useEffect(() => {
        getUsers('GET', '/table').then(data => {
            let rows = Object.assign([], data.map(item => {
                item.id = item._id
                item.registerAt = moment(item.registerAt).format('DD.MM.YYYY HH:mm')

                if (auth.userId === item._id && item.status === 'BLOCKED') auth.logout(auth.userId)

                return item
            }))

            setRows(rows)
        })
    }, [blockHandler, unblockHandler, deleteHandler])

    const columns = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'username', headerName: 'Username', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'registerAt', headerName: 'RegisterAt', width: 170 },
        { field: 'status', headerName: 'Status', width: 130 },

    ];

    return (
        <div style={{ height: 800, width: '100%' }}>
            <button className="btn orange darken-3"
                    style={{ marginRight: 5 }}
                    disabled={loading}
                    onClick={blockHandler}>
                        Block
                    </button>
            <button className="btn green"
                            style={{ marginRight: 5 }}
                            disabled={loading}
                            onClick={unblockHandler}>
                        UnBlock
                    </button>
            <button className="btn red"
                    disabled={loading}
                    onClick={deleteHandler}>
                        Delete
                    </button>
            <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection
                      onSelectionModelChange={(newSelection) => {
                          setSelectionModel(newSelection.selectionModel);
                      }}
                      selectionModel={selectionModel}/>
        </div>
    )
}
