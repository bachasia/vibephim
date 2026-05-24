import { useState, useEffect } from 'react'
import { getCategories, getCountries, getMoviesByCategory, getMoviesByCountry } from '../services/ophim-api.js'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getCategories()
      .then((data) => {
        if (cancelled) return
        setCategories(data.data?.items || [])
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { categories, loading, error }
}

export function useCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getCountries()
      .then((data) => {
        if (cancelled) return
        setCountries(data.data?.items || [])
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { countries, loading, error }
}

export function useCategoryMovies(slug, page = 1) {
  const [movies, setMovies] = useState([])
  const [pagination, setPagination] = useState(null)
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)

    getMoviesByCategory(slug, page)
      .then((data) => {
        if (cancelled) return
        setMovies(data.data?.items || [])
        setPagination(data.data?.params?.pagination || null)
        setCategoryInfo(data.data?.titlePage || null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug, page])

  return { movies, pagination, categoryInfo, loading, error }
}

export function useCountryMovies(slug, page = 1) {
  const [movies, setMovies] = useState([])
  const [pagination, setPagination] = useState(null)
  const [countryInfo, setCountryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)

    getMoviesByCountry(slug, page)
      .then((data) => {
        if (cancelled) return
        setMovies(data.data?.items || [])
        setPagination(data.data?.params?.pagination || null)
        setCountryInfo(data.data?.titlePage || null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug, page])

  return { movies, pagination, countryInfo, loading, error }
}
