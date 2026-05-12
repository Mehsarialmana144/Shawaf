import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

const emptyForm = {
  name: '',
  name_ar: '',
  city: '',
  category: '',
  description: '',
  description_ar: '',
  opening_time: '',
  closing_time: '',
  estimated_duration: '',
  latitude: '',
  longitude: '',
  price_range: '',
  availability_type: 'permanent',
  status: 'active',
}

const cities = [
  'Riyadh',
  'Diriyah',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Al-Khobar',
  'Dhahran',
  'Al-Ahsa',
  'Al-Ula',
  'Abha',
  'Taif',
  'Yanbu',
  'Tabuk',
  'Hail',
  'Najran',
  'Jizan',
  'Buraidah',
  'Jubail',
  'Al-Baha',
  'Sakaka',
  'Hafar Al-Batin',
  'KAEC',
]

const categories = [
  'Landmark',
  'Museum',
  'Historical',
  'Heritage',
  'Entertainment',
  'Shopping',
  'Culture',
  'Outdoor',
  'Natural',
  'Restaurant',
]

const CITY_LABELS_AR = {
  Riyadh: 'الرياض',
  Diriyah: 'الدرعية',
  Jeddah: 'جدة',
  Mecca: 'مكة',
  Medina: 'المدينة المنورة',
  Dammam: 'الدمام',
  'Al-Khobar': 'الخبر',
  Dhahran: 'الظهران',
  'Al-Ahsa': 'الأحساء',
  'Al-Ula': 'العلا',
  Abha: 'أبها',
  Taif: 'الطائف',
  Yanbu: 'ينبع',
  Tabuk: 'تبوك',
  Hail: 'حائل',
  Najran: 'نجران',
  Jizan: 'جازان',
  Buraidah: 'بريدة',
  Jubail: 'الجبيل',
  'Al-Baha': 'الباحة',
  Sakaka: 'سكاكا',
  'Hafar Al-Batin': 'حفر الباطن',
  KAEC: 'مدينة الملك عبدالله الاقتصادية',
}

const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

const STATUS_LABELS_AR = {
  active: 'نشط',
  inactive: 'غير نشط',
}

const AVAILABILITY_LABELS_AR = {
  permanent: 'دائم',
  seasonal: 'موسمي',
  temporary: 'مؤقت',
}

function getCityLabel(city, lang) {
  if (!city) return ''
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function getCategoryLabel(category, lang) {
  if (!category) return ''
  return lang === 'ar' ? CATEGORY_LABELS_AR[category] || category : category
}

function getStatusLabel(status, lang) {
  if (!status) return ''
  return lang === 'ar' ? STATUS_LABELS_AR[status] || status : status
}

function getAvailabilityLabel(value, lang) {
  if (!value) return ''
  return lang === 'ar' ? AVAILABILITY_LABELS_AR[value] || value : value
}

function getDisplayName(item, lang) {
  if (lang === 'ar') return item.name_ar || item.name
  return item.name
}

export default function AdminAttractions() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'إدارة المعالم' : 'Manage Attractions',
    subtitle: isArabic
      ? 'إضافة أو تعديل أو تعطيل أو حذف المعالم المستخدمة في شواف.'
      : 'Add, edit, disable, or delete attractions used by Shawaf.',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    formTitleAdd: isArabic ? 'إضافة معلم جديد' : 'Add Attraction',
    formTitleEdit: isArabic ? 'تعديل المعلم' : 'Edit Attraction',
    attractions: isArabic ? 'المعالم' : 'Attractions',
    allCities: isArabic ? 'كل المدن' : 'All Cities',
    allStatus: isArabic ? 'كل الحالات' : 'All Status',
    active: isArabic ? 'نشط' : 'Active',
    inactive: isArabic ? 'غير نشط' : 'Inactive',
    name: isArabic ? 'الاسم الإنجليزي' : 'English Name',
    nameAr: isArabic ? 'الاسم العربي' : 'Arabic Name',
    city: isArabic ? 'المدينة' : 'City',
    category: isArabic ? 'التصنيف' : 'Category',
    description: isArabic ? 'الوصف الإنجليزي' : 'English Description',
    descriptionAr: isArabic ? 'الوصف العربي' : 'Arabic Description',
    openingTime: isArabic ? 'وقت الفتح' : 'Opening Time',
    closingTime: isArabic ? 'وقت الإغلاق' : 'Closing Time',
    duration: isArabic ? 'المدة بالدقائق' : 'Estimated Duration',
    latitude: isArabic ? 'خط العرض' : 'Latitude',
    longitude: isArabic ? 'خط الطول' : 'Longitude',
    priceRange: isArabic ? 'نطاق السعر' : 'Price Range',
    availability: isArabic ? 'نوع الإتاحة' : 'Availability Type',
    status: isArabic ? 'الحالة' : 'Status',
    hours: isArabic ? 'الساعات' : 'Hours',
    actions: isArabic ? 'الإجراءات' : 'Actions',
    save: isArabic ? 'حفظ' : 'Save',
    update: isArabic ? 'تحديث' : 'Update',
    saving: isArabic ? 'جاري الحفظ...' : 'Saving...',
    cancel: isArabic ? 'إلغاء' : 'Cancel',
    edit: isArabic ? 'تعديل' : 'Edit',
    delete: isArabic ? 'حذف' : 'Delete',
    disable: isArabic ? 'تعطيل' : 'Disable',
    activate: isArabic ? 'تفعيل' : 'Activate',
    noAttractions: isArabic ? 'لا توجد معالم.' : 'No attractions found.',
    noCoordinates: isArabic ? 'لا توجد إحداثيات' : 'No coordinates',
    notSet: isArabic ? 'غير محدد' : 'Not set',
    selectCity: isArabic ? 'اختر المدينة' : 'Select city',
    selectCategory: isArabic ? 'اختر التصنيف' : 'Select category',
    selectStatus: isArabic ? 'اختر الحالة' : 'Select status',
    permanent: isArabic ? 'دائم' : 'Permanent',
    seasonal: isArabic ? 'موسمي' : 'Seasonal',
    temporary: isArabic ? 'مؤقت' : 'Temporary',
    nameRequired: isArabic ? 'اسم المعلم الإنجليزي مطلوب.' : 'English attraction name is required.',
    cityRequired: isArabic ? 'المدينة مطلوبة.' : 'City is required.',
    categoryRequired: isArabic ? 'التصنيف مطلوب.' : 'Category is required.',
    latNumber: isArabic ? 'خط العرض يجب أن يكون رقمًا.' : 'Latitude must be a number.',
    lngNumber: isArabic ? 'خط الطول يجب أن يكون رقمًا.' : 'Longitude must be a number.',
    durationNumber: isArabic
      ? 'المدة المتوقعة يجب أن تكون رقمًا.'
      : 'Estimated duration must be a number.',
    added: isArabic ? 'تمت إضافة المعلم بنجاح.' : 'Attraction added successfully.',
    updated: isArabic ? 'تم تحديث المعلم بنجاح.' : 'Attraction updated successfully.',
    deleted: isArabic ? 'تم حذف المعلم بنجاح.' : 'Attraction deleted successfully.',
    confirmDelete: isArabic
      ? 'هل تريد حذف هذا المعلم نهائيًا؟'
      : 'Delete this attraction permanently?',
  }

  const [attractions, setAttractions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadAttractions()
  }, [])

  const loadAttractions = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('attractions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setAttractions(data || [])
    }

    setLoading(false)
  }

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setMessage('')
    setError('')
  }

  const validateForm = () => {
    if (!form.name.trim()) return text.nameRequired
    if (!form.city.trim()) return text.cityRequired
    if (!form.category.trim()) return text.categoryRequired
    if (form.latitude && Number.isNaN(Number(form.latitude))) return text.latNumber
    if (form.longitude && Number.isNaN(Number(form.longitude))) return text.lngNumber
    if (form.estimated_duration && Number.isNaN(Number(form.estimated_duration))) {
      return text.durationNumber
    }

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      setSaving(false)
      return
    }

    const payload = {
      name: form.name.trim(),
      name_ar: form.name_ar.trim() || null,
      city: form.city,
      category: form.category,
      description: form.description.trim() || null,
      description_ar: form.description_ar.trim() || null,
      opening_time: form.opening_time || null,
      closing_time: form.closing_time || null,
      estimated_duration: form.estimated_duration
        ? Number(form.estimated_duration)
        : null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      price_range: form.price_range.trim() || null,
      availability_type: form.availability_type,
      status: form.status,
      updated_at: new Date().toISOString(),
    }

    const result = editingId
      ? await supabase.from('attractions').update(payload).eq('id', editingId)
      : await supabase.from('attractions').insert([payload])

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    setMessage(editingId ? text.updated : text.added)
    resetForm()
    await loadAttractions()
    setSaving(false)
  }

  const handleEdit = (attraction) => {
    setEditingId(attraction.id)
    setForm({
      name: attraction.name || '',
      name_ar: attraction.name_ar || '',
      city: attraction.city || '',
      category: attraction.category || '',
      description: attraction.description || '',
      description_ar: attraction.description_ar || '',
      opening_time: attraction.opening_time || '',
      closing_time: attraction.closing_time || '',
      estimated_duration: attraction.estimated_duration || '',
      latitude: attraction.latitude || '',
      longitude: attraction.longitude || '',
      price_range: attraction.price_range || '',
      availability_type: attraction.availability_type || 'permanent',
      status: attraction.status || 'active',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm(text.confirmDelete)) return

    const { error } = await supabase.from('attractions').delete().eq('id', id)

    if (error) {
      setError(error.message)
      return
    }

    setMessage(text.deleted)
    await loadAttractions()
  }

  const handleToggleStatus = async (attraction) => {
    const newStatus = attraction.status === 'active' ? 'inactive' : 'active'

    const { error } = await supabase
      .from('attractions')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', attraction.id)

    if (error) {
      setError(error.message)
      return
    }

    await loadAttractions()
  }

  const filteredAttractions = attractions.filter((item) => {
    const cityMatch = cityFilter === 'all' || item.city === cityFilter
    const statusMatch = statusFilter === 'all' || item.status === statusFilter
    return cityMatch && statusMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{text.title}</h1>
          <p className="text-sm text-stone-500 mt-1">{text.subtitle}</p>
        </div>

        <button onClick={loadAttractions} className="btn-outline">
          {text.refresh}
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-5">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <h2 className="font-semibold text-stone-900">
            {editingId ? text.formTitleEdit : text.formTitleAdd}
          </h2>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.name}
            </label>
            <input
              className="input-field mt-1"
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.nameAr}
            </label>
            <input
              className="input-field mt-1"
              value={form.name_ar}
              onChange={(e) => updateForm('name_ar', e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.city}
            </label>
            <select
              className="input-field mt-1"
              value={form.city}
              onChange={(e) => updateForm('city', e.target.value)}
            >
              <option value="">{text.selectCity}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {getCityLabel(city, lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.category}
            </label>
            <select
              className="input-field mt-1"
              value={form.category}
              onChange={(e) => updateForm('category', e.target.value)}
            >
              <option value="">{text.selectCategory}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category, lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.description}
            </label>
            <textarea
              className="input-field mt-1 h-24 resize-none"
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.descriptionAr}
            </label>
            <textarea
              className="input-field mt-1 h-24 resize-none"
              value={form.description_ar}
              onChange={(e) => updateForm('description_ar', e.target.value)}
              dir="auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-500">
                {text.openingTime}
              </label>
              <input
                type="time"
                className="input-field mt-1"
                value={form.opening_time}
                onChange={(e) => updateForm('opening_time', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500">
                {text.closingTime}
              </label>
              <input
                type="time"
                className="input-field mt-1"
                value={form.closing_time}
                onChange={(e) => updateForm('closing_time', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.duration}
            </label>
            <input
              className="input-field mt-1"
              value={form.estimated_duration}
              onChange={(e) => updateForm('estimated_duration', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-500">
                {text.latitude}
              </label>
              <input
                className="input-field mt-1"
                value={form.latitude}
                onChange={(e) => updateForm('latitude', e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500">
                {text.longitude}
              </label>
              <input
                className="input-field mt-1"
                value={form.longitude}
                onChange={(e) => updateForm('longitude', e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.priceRange}
            </label>
            <input
              className="input-field mt-1"
              value={form.price_range}
              onChange={(e) => updateForm('price_range', e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.availability}
            </label>
            <select
              className="input-field mt-1"
              value={form.availability_type}
              onChange={(e) => updateForm('availability_type', e.target.value)}
            >
              <option value="permanent">{text.permanent}</option>
              <option value="seasonal">{text.seasonal}</option>
              <option value="temporary">{text.temporary}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500">
              {text.status}
            </label>
            <select
              className="input-field mt-1"
              value={form.status}
              onChange={(e) => updateForm('status', e.target.value)}
            >
              <option value="active">{text.active}</option>
              <option value="inactive">{text.inactive}</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {saving ? text.saving : editingId ? text.update : text.save}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm} className="btn-outline">
                {text.cancel}
              </button>
            )}
          </div>
        </form>

        <div className="card p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h2 className="font-semibold text-stone-900">{text.attractions}</h2>

            <div className="flex gap-2">
              <select
                className="border border-stone-300 rounded-xl px-3 py-2 text-sm bg-white"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="all">{text.allCities}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {getCityLabel(city, lang)}
                  </option>
                ))}
              </select>

              <select
                className="border border-stone-300 rounded-xl px-3 py-2 text-sm bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{text.allStatus}</option>
                <option value="active">{text.active}</option>
                <option value="inactive">{text.inactive}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-stone-500 border-b border-stone-100">
                  <th className="text-start pb-3 font-medium">{text.name}</th>
                  <th className="text-start pb-3 font-medium">{text.city}</th>
                  <th className="text-start pb-3 font-medium">{text.category}</th>
                  <th className="text-start pb-3 font-medium">{text.hours}</th>
                  <th className="text-start pb-3 font-medium">{text.status}</th>
                  <th className="text-start pb-3 font-medium">{text.actions}</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttractions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-stone-400">
                      {text.noAttractions}
                    </td>
                  </tr>
                ) : (
                  filteredAttractions.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-stone-50 last:border-0"
                    >
                      <td className="py-3.5 font-medium text-stone-900" dir="auto">
                        {getDisplayName(item, lang)}

                        {lang === 'ar' && item.name_ar && (
                          <div className="text-xs text-stone-400 mt-0.5" dir="ltr">
                            {item.name}
                          </div>
                        )}

                        <div className="text-xs text-stone-400 mt-0.5" dir="ltr">
                          {item.latitude && item.longitude
                            ? `${item.latitude}, ${item.longitude}`
                            : text.noCoordinates}
                        </div>
                      </td>

                      <td className="py-3.5 text-stone-600">
                        {getCityLabel(item.city, lang)}
                      </td>

                      <td className="py-3.5 text-stone-600">
                        {getCategoryLabel(item.category, lang)}
                      </td>

                      <td className="py-3.5 text-stone-600">
                        {item.opening_time && item.closing_time
                          ? `${String(item.opening_time).slice(0, 5)} - ${String(
                              item.closing_time
                            ).slice(0, 5)}`
                          : text.notSet}
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {getStatusLabel(item.status, lang)}
                        </span>
                      </td>

                      <td className="py-3.5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100"
                          >
                            {text.edit}
                          </button>

                          <button
                            onClick={() => handleToggleStatus(item)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200"
                          >
                            {item.status === 'active' ? text.disable : text.activate}
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            {text.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}