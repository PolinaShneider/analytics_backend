import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'

import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add'
import EditIcon from "@mui/icons-material/EditOutlined";

import { rootState } from '../../../store/reducers'

import actions from '../actions'
import {getWorkProgramCompetences, getWorkProgramId} from '../getters'

import IndicatorsDialog from './IndicatorDialog'
import {UpdateZunDialog} from './UpdateZunDialog'

import { useStyles } from './Competences.styles'

export default React.memo(() => {
  const dispatch = useDispatch()
  const [isOpenIndicatorDialog, setIsOpenIndicatorDialog] = useState(false)
  const [isOpenUpdateZunDialog, setIsOpenUpdateZunDialog] = useState<any>(false)
  const [dialogCompetence, setDialogCompetence] = useState<{value: number; label: string} | undefined>(undefined)

  const competences = useSelector((state: rootState) => getWorkProgramCompetences(state))
  const workProgramId = useSelector((state: rootState) => getWorkProgramId(state))
  const classes = useStyles()

  const handleCloseDialog = () => {
    setDialogCompetence(undefined)
    setIsOpenIndicatorDialog(false)
  }

  const handleCreateZUN = () => {
    setIsOpenIndicatorDialog(true)
  }

  useEffect(() => {
    if (workProgramId) {
      dispatch(actions.getResults(workProgramId))
    }
  }, [workProgramId]);

  const deleteZun = (zunId: number) => {
    dispatch(actions.deleteZUN(zunId))
  }

  return (
    <>
      <Typography className={classes.subTitle}>
        Компетенции
        <Button
          onClick={handleCreateZUN}
          variant="outlined"
          className={classes.addZUNButton}
          color="secondary"
        >
          Добавить ЗУН
        </Button>
      </Typography>

      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell className={classes.header}>
              Компетенция
            </TableCell>
            <TableCell className={classes.header}>
              Индикатор
            </TableCell>
            <TableCell className={classes.header}>
              Результаты
            </TableCell>
            <TableCell className={classes.header}>
              Учебный план
            </TableCell>
            <TableCell className={classes.header}>
              ЗУН
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {competences.map((competence: any) => {
            const zuns = competence?.zuns ?? []
            const addIndicatorButton = (
              <div className={classes.smallButton}
                   onClick={() => {
                     setIsOpenIndicatorDialog(true)
                     setDialogCompetence({
                       label: competence.name,
                       value: competence.id,
                     })
                   }}
              >
                <AddIcon/> Добавить индикатор
              </div>
            )
            if (zuns.length === 0){
              return (
                <TableRow>
                  <TableCell className={classes.cell}>
                    {competence.number} {competence.name}
                  </TableCell>
                  <TableCell className={classes.cell}>
                    {addIndicatorButton}
                  </TableCell>
                </TableRow>
              )
            }

            return zuns.map((zun: any, index: number) => (
              <TableRow key={competence.number + 'zun' + index}>
                {index === 0 ?
                  <TableCell rowSpan={zuns.length} className={classes.cell}>
                    {competence.number} {competence.name}
                    {addIndicatorButton}
                  </TableCell>
                  : <></>
                }
                <TableCell>
                  {zun?.indicator?.number} {zun?.indicator?.name}
                  <div className={classes.smallButton}
                       onClick={() => deleteZun(zun.id)}
                  >
                    Удалить индикатор
                  </div>
                </TableCell>
                <TableCell className={classes.cell}>
                  {get(zun, 'items', []).map((item: any) => (
                    <div key={competence.number + 'zun' + index + item.id}>
                      {item.name}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {get(zun, 'educational_program', []).map((educationalProgram: any) =>
                      get(educationalProgram, 'field_of_study', []).map((fieldOfStudy: any) => (
                        <div key={fieldOfStudy.id}>
                          {get(fieldOfStudy, 'number', '')} {get(fieldOfStudy, 'title', '')}
                        </div>
                      ))
                  )}
                </TableCell>
                <TableCell className={classes.cell}>
                  {[zun?.knowledge, zun?.skills, zun?.attainments].filter(item => Boolean(item)).join(' / ')}
                  <IconButton onClick={() => setIsOpenUpdateZunDialog(zun)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          })}
        </TableBody>
      </Table>

      <IndicatorsDialog
        isOpen={isOpenIndicatorDialog}
        handleClose={handleCloseDialog}
        defaultCompetence={dialogCompetence}
        workProgramId={workProgramId}
      />
      {isOpenUpdateZunDialog ?
        <UpdateZunDialog
          isOpen
          handleClose={() => setIsOpenUpdateZunDialog(false)}
          zunId={isOpenUpdateZunDialog.id}
          defaultAttainments={isOpenUpdateZunDialog?.attainments}
          defaultSkills={isOpenUpdateZunDialog?.skills}
          defaultKnowledge={isOpenUpdateZunDialog?.knowledge}
        /> : null
      }
    </>
  )
})
