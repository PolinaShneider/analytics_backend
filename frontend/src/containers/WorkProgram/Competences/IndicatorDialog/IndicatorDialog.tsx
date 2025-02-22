import React, {useCallback, useEffect, useState, useMemo} from 'react'
import { Dialog } from '@mui/material'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InfoIcon from "@mui/icons-material/InfoOutlined";
import CompetenceSelector from '../../../Competences/CompetenceSelector'
import IndicatorSelector from '../../../Competences/Indicators/IndicatorSelector'
import ResultsSelector from '../../Results/ResultsSeletor'
import PlanSelector from '../../../EducationalPlan/WorkProgramPlansSelector'
import { useStyles } from './IndicatorDialog.styles'
import actions from '../../actions'
import {useDispatch} from 'react-redux'
import Tooltip from "@mui/material/Tooltip/Tooltip";

interface IndicatorsProps {
  workProgramId: number;
  isOpen: boolean;
  defaultCompetence?: {
    value: number;
    label: string;
  };
  defaultIndicator?: {
    value: number;
    label: string;
  };
  isEditMode?: boolean;
  handleClose: () => void;
}

export default ({ isOpen, isEditMode, handleClose, defaultCompetence, defaultIndicator, workProgramId }: IndicatorsProps) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [competence, setCompetence] = useState<{value: number; label: string}>({value: 0, label: ''})
  const [indicator, setIndicator] = useState<{value: number; label: string}>({value: 0, label: ''})
  const [results, setResults] = useState<Array<{value: number; label: string}>>([])
  const [plans, setPlans] = useState<Array<{value: number; label: string}>>([])
  const [knowledge, changeKnowledge] = useState('')
  const [skills, changeSkills] = useState('')
  const [attainments, changeAttainments] = useState('')

  const addIndicator = (value: number, label: string) => {
    setIndicator({
      value,
      label
    })
  }

  const addCompetence = (value: number, label: string) => {
    setCompetence({
      value,
      label
    })
  }

  const addResult = useCallback((value: number, label: string) => {
    if (results.find(item => item.value === value)) return
    if (value) {
      setResults([
        ...results,
        {
          value,
          label
        }
      ])
    }
  }, [results])

  const removeResult = useCallback((value: number) => {
    setResults(results.filter(result => result.value !== value))
  }, [results])

  const addPlan = useCallback((value: number, label: string) => {
    if (plans.find(item => item.value === value)) return
    if (value) {
      setPlans([
        ...plans,
        {
          value,
          label
        }
      ])
    }
  }, [plans])

  const removePlan = useCallback((value: number) => {
    setPlans(plans.filter(plan => plan.value !== value))
  }, [plans])

  const saveZun = useCallback(() => {
    dispatch(actions.saveZUN({
      indicator: indicator.value,
      results: results.map(item => item.value),
      plans: plans.map(item => item.value),
      knowledge,
      skills,
      attainments,
    }))
    handleClose()
  }, [indicator, competence, results, plans, knowledge, skills, attainments])

  const disableButton = useMemo(() => (indicator.value === 0 || competence.value === 0 || results.length === 0),
    [indicator, competence, results, plans]
  )

  useEffect(() => {
    setIndicator({value: 0, label: ''})
  }, [competence])

  useEffect(() => {
    if (defaultCompetence){
      setCompetence(defaultCompetence)
    }
  }, [defaultCompetence])

  useEffect(() => {
    if (defaultIndicator){
      setIndicator(defaultIndicator)
    }
  }, [defaultIndicator])

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="sm"
      classes={{
        paper: classes.dialog
      }}
    >
      <DialogTitle className={classes.title}> {isEditMode ? 'Редактирование' : 'Добавление'} индикатора ко всем связным ОХ</DialogTitle>
      <CompetenceSelector
        onChange={addCompetence}
        value={competence.value}
        valueLabel={competence.label}
        label="Компетенция"
        className={classes.marginBottom30}
        disabled={Boolean(defaultCompetence)}
      />
      <IndicatorSelector
        onChange={addIndicator}
        value={0}
        label="Индикатор"
        className={classes.marginBottom30}
        competenceId={competence.value}
        disabled={competence.value === 0 || Boolean(defaultIndicator)}
      />
      <ResultsSelector
        label="Результат"
        onChange={addResult}
        valueLabel=""
        value={0}
      />
      <div className={classes.chipsList}>
        {results.map(result => (
          <Chip key={`result-${result.value}`} className={classes.chip} onDelete={() => removeResult(result.value)} label={result.label} />
        ))}
      </div>
      {/*<PlanSelector*/}
      {/*  label="Учебный план и образовательная программа"*/}
      {/*  onChange={addPlan}*/}
      {/*  valueLabel=""*/}
      {/*  value={0}*/}
      {/*  workProgramId={workProgramId}*/}
      {/*/>*/}
      {/*<div className={classes.chipsList}>*/}
      {/*  {plans.map(plan => (*/}
      {/*    <Chip key={`result-${plan.value}`} className={classes.chip} onDelete={() => removePlan(plan.value)} label={plan.label} />*/}
      {/*  ))}*/}
      {/*</div>*/}
      <TextField
        label="Знания"
        onChange={(e) => changeKnowledge(e.currentTarget.value)}
        variant="outlined"
        className={classes.marginBottom30}
      />
      <TextField
        label="Умения"
        onChange={(e) => changeSkills(e.currentTarget.value)}
        variant="outlined"
        className={classes.marginBottom30}
      />
      <TextField
        label="Навыки"
        onChange={(e) => changeAttainments(e.currentTarget.value)}
        variant="outlined"
      />
      <div className={classes.footer}>
        <Tooltip title="При выборе результатов и учебного плана с ОП можно выбрать несколько объектов, выбирая их по очереди">
          <InfoIcon className={classes.info}/>
        </Tooltip>
        <DialogActions className={classes.actions}>
          <Button onClick={handleClose}
                  variant="text">
            Отмена
          </Button>
          <Button onClick={saveZun}
                  variant="contained"
                  disabled={disableButton}
                  color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}
