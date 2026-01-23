/**
 * Wesole Nutki - Decap CMS Preview Templates
 * Custom preview templates that match the live site styling
 */

// Register the default media library
// This is required by Decap CMS to enable media uploads
if (typeof CMS !== 'undefined') {
  CMS.registerMediaLibrary({
    name: 'default'
  });
}

// Helper function to format dates in Polish locale
const formatDate = (dateString, locale = 'pl') => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', options);
  } catch {
    return dateString;
  }
};

// Helper to get image URL (handles both absolute and relative paths)
const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  // Convert /images/ path to work with CMS preview
  return image;
};

// ============================================================
// NEWS ARTICLE PREVIEW TEMPLATE
// ============================================================
const NewsPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Untitled';
    const date = entry.getIn(['data', 'date']);
    const featuredImage = entry.getIn(['data', 'featured_image']);
    const summary = entry.getIn(['data', 'summary']) || '';
    const categories = entry.getIn(['data', 'categories']);
    const tags = entry.getIn(['data', 'tags']);
    const body = this.props.widgetFor('body');
    const language = entry.getIn(['data', 'language']) || 'pl';

    return h('div', { className: 'preview-container' },
      // Page header with breadcrumb
      h('div', { className: 'page-header' },
        h('div', { className: 'container' },
          h('nav', { className: 'breadcrumb-nav' },
            h('span', {}, language === 'pl' ? 'Strona glowna' : 'Home'),
            h('span', { className: 'separator' }, ' / '),
            h('span', {}, language === 'pl' ? 'Aktualnosci' : 'News'),
            h('span', { className: 'separator' }, ' / '),
            h('span', { className: 'current' }, title)
          ),
          h('h1', { className: 'page-title' }, title)
        )
      ),

      // Main content
      h('div', { className: 'container' },
        h('article', { className: 'news-article' },
          // Article header
          h('header', { className: 'article-header' },
            // Featured image
            featuredImage && h('div', { className: 'featured-image-wrapper' },
              h('img', {
                src: getImageUrl(featuredImage),
                alt: title,
                className: 'featured-image'
              })
            ),

            // Meta info
            h('div', { className: 'article-meta' },
              date && h('span', { className: 'date' },
                h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                  h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
                  h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
                  h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
                  h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
                ),
                formatDate(date, language)
              )
            ),

            // Categories
            categories && categories.size > 0 && h('div', { className: 'categories' },
              categories.map((cat, index) =>
                h('span', { key: index, className: 'category-badge' }, cat)
              )
            )
          ),

          // Summary
          summary && h('div', { className: 'article-summary' },
            h('p', {}, summary)
          ),

          // Article body
          h('div', { className: 'article-content' }, body),

          // Tags
          tags && tags.size > 0 && h('footer', { className: 'article-footer' },
            h('div', { className: 'tags' },
              h('span', { className: 'tags-label' }, language === 'pl' ? 'Tagi: ' : 'Tags: '),
              tags.map((tag, index) =>
                h('span', { key: index, className: 'tag' }, tag)
              )
            )
          )
        )
      )
    );
  }
});

// ============================================================
// PAGE PREVIEW TEMPLATE (Generic pages)
// ============================================================
const PagePreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Untitled';
    const description = entry.getIn(['data', 'description']) || '';
    const body = this.props.widgetFor('body');

    return h('div', { className: 'preview-container' },
      // Page header
      h('div', { className: 'page-header' },
        h('div', { className: 'container' },
          h('h1', { className: 'page-title' }, title),
          description && h('p', { className: 'page-description' }, description)
        )
      ),

      // Main content
      h('div', { className: 'container' },
        h('div', { className: 'page-content' }, body)
      )
    );
  }
});

// ============================================================
// GALLERY ALBUM PREVIEW TEMPLATE
// ============================================================
const GalleryPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Untitled Album';
    const description = entry.getIn(['data', 'description']) || '';
    const date = entry.getIn(['data', 'date']);
    const featuredImage = entry.getIn(['data', 'featured_image']);
    const images = entry.getIn(['data', 'images']);
    const categories = entry.getIn(['data', 'categories']);
    const body = this.props.widgetFor('body');

    return h('div', { className: 'preview-container' },
      // Page header
      h('div', { className: 'page-header' },
        h('div', { className: 'container' },
          h('nav', { className: 'breadcrumb-nav' },
            h('span', {}, 'Strona glowna'),
            h('span', { className: 'separator' }, ' / '),
            h('span', {}, 'Galeria'),
            h('span', { className: 'separator' }, ' / '),
            h('span', { className: 'current' }, title)
          ),
          h('h1', { className: 'page-title' }, title)
        )
      ),

      // Main content
      h('div', { className: 'container' },
        h('div', { className: 'gallery-album' },
          // Album info
          h('div', { className: 'album-info' },
            date && h('div', { className: 'date' },
              h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
                h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
                h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
                h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
              ),
              formatDate(date)
            ),
            categories && categories.size > 0 && h('div', { className: 'categories' },
              categories.map((cat, index) =>
                h('span', { key: index, className: 'category-badge' }, cat)
              )
            )
          ),

          // Description
          description && h('p', { className: 'album-description' }, description),

          // Gallery grid
          images && images.size > 0 && h('div', { className: 'gallery-grid' },
            images.map((img, index) => {
              const src = img.get('src');
              const caption = img.get('caption') || '';
              const alt = img.get('alt') || caption || title;

              return h('div', { key: index, className: 'gallery-item' },
                src && h('img', {
                  src: getImageUrl(src),
                  alt: alt,
                  className: 'gallery-image'
                }),
                caption && h('div', { className: 'gallery-caption' }, caption)
              );
            })
          ),

          // Additional content
          body && h('div', { className: 'album-content' }, body)
        )
      )
    );
  }
});

// ============================================================
// PROGRAM PREVIEW TEMPLATE
// ============================================================
const ProgramPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Untitled Program';
    const description = entry.getIn(['data', 'description']) || '';
    const icon = entry.getIn(['data', 'icon']) || '';
    const ageGroup = entry.getIn(['data', 'age_group']) || '';
    const groupSize = entry.getIn(['data', 'group_size']) || '';
    const hours = entry.getIn(['data', 'hours']) || '';
    const summary = entry.getIn(['data', 'summary']) || '';
    const featuredImage = entry.getIn(['data', 'featured_image']);
    const features = entry.getIn(['data', 'features']);
    const activities = entry.getIn(['data', 'activities']);
    const schedule = entry.getIn(['data', 'schedule']);
    const body = this.props.widgetFor('body');

    return h('div', { className: 'preview-container' },
      // Page header
      h('div', { className: 'page-header program-header' },
        h('div', { className: 'container' },
          h('nav', { className: 'breadcrumb-nav' },
            h('span', {}, 'Strona glowna'),
            h('span', { className: 'separator' }, ' / '),
            h('span', {}, 'Programy'),
            h('span', { className: 'separator' }, ' / '),
            h('span', { className: 'current' }, title)
          ),
          h('div', { className: 'program-title-wrapper' },
            icon && h('span', { className: 'program-icon' }, icon),
            h('h1', { className: 'page-title' }, title)
          )
        )
      ),

      // Main content
      h('div', { className: 'container' },
        h('div', { className: 'program-page' },
          // Program overview card
          h('div', { className: 'program-overview card' },
            featuredImage && h('div', { className: 'program-image-wrapper' },
              h('img', {
                src: getImageUrl(featuredImage),
                alt: title,
                className: 'program-image'
              })
            ),
            h('div', { className: 'program-details' },
              // Quick info
              h('div', { className: 'quick-info' },
                ageGroup && h('div', { className: 'info-item' },
                  h('span', { className: 'info-icon' }, '👶'),
                  h('span', { className: 'info-label' }, 'Wiek: '),
                  h('span', { className: 'info-value' }, ageGroup)
                ),
                groupSize && h('div', { className: 'info-item' },
                  h('span', { className: 'info-icon' }, '👥'),
                  h('span', { className: 'info-label' }, 'Grupa: '),
                  h('span', { className: 'info-value' }, groupSize)
                ),
                hours && h('div', { className: 'info-item' },
                  h('span', { className: 'info-icon' }, '🕐'),
                  h('span', { className: 'info-label' }, 'Godziny: '),
                  h('span', { className: 'info-value' }, hours)
                )
              ),
              summary && h('p', { className: 'program-summary' }, summary)
            )
          ),

          // Features
          features && features.size > 0 && h('section', { className: 'program-section' },
            h('h2', { className: 'section-title' }, 'Glowne cechy'),
            h('ul', { className: 'features-list' },
              features.map((feature, index) =>
                h('li', { key: index, className: 'feature-item' },
                  h('span', { className: 'feature-check' }, '✓'),
                  feature
                )
              )
            )
          ),

          // Activities
          activities && activities.size > 0 && h('section', { className: 'program-section' },
            h('h2', { className: 'section-title' }, 'Zajecia'),
            h('div', { className: 'activities-grid' },
              activities.map((activity, index) => {
                const actTitle = activity.get('title') || '';
                const actIcon = activity.get('icon') || '📚';
                const actDesc = activity.get('description') || '';

                return h('div', { key: index, className: 'activity-card' },
                  h('div', { className: 'activity-icon' }, actIcon),
                  h('h3', { className: 'activity-title' }, actTitle),
                  actDesc && h('p', { className: 'activity-desc' }, actDesc)
                );
              })
            )
          ),

          // Daily Schedule
          schedule && schedule.size > 0 && h('section', { className: 'program-section' },
            h('h2', { className: 'section-title' }, 'Plan dnia'),
            h('div', { className: 'schedule-list' },
              schedule.map((item, index) => {
                const time = item.get('time') || '';
                const activity = item.get('activity') || '';

                return h('div', { key: index, className: 'schedule-item' },
                  h('div', { className: 'schedule-time' }, time),
                  h('div', { className: 'schedule-activity' }, activity)
                );
              })
            )
          ),

          // Body content
          body && h('section', { className: 'program-section' },
            h('div', { className: 'program-content' }, body)
          )
        )
      )
    );
  }
});

// ============================================================
// ABOUT PAGE PREVIEW TEMPLATE
// ============================================================
const AboutPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'O nas';
    const description = entry.getIn(['data', 'description']) || '';
    const featuredImage = entry.getIn(['data', 'featured_image']);
    const sections = entry.getIn(['data', 'sections']);
    const team = entry.getIn(['data', 'team']);
    const body = this.props.widgetFor('body');

    return h('div', { className: 'preview-container' },
      // Page header
      h('div', { className: 'page-header' },
        h('div', { className: 'container' },
          h('h1', { className: 'page-title' }, title),
          description && h('p', { className: 'page-description' }, description)
        )
      ),

      // Main content
      h('div', { className: 'container' },
        // Featured image
        featuredImage && h('div', { className: 'about-featured-image' },
          h('img', {
            src: getImageUrl(featuredImage),
            alt: title,
            className: 'featured-image'
          })
        ),

        // Sections
        sections && sections.size > 0 && h('div', { className: 'about-sections' },
          sections.map((section, index) => {
            const sectionTitle = section.get('title') || '';
            const sectionContent = section.get('content') || '';
            const sectionImage = section.get('image');

            return h('section', { key: index, className: 'about-section' },
              h('h2', { className: 'section-title' }, sectionTitle),
              sectionImage && h('img', {
                src: getImageUrl(sectionImage),
                alt: sectionTitle,
                className: 'section-image'
              }),
              h('div', { className: 'section-content', dangerouslySetInnerHTML: { __html: sectionContent } })
            );
          })
        ),

        // Team section
        team && team.size > 0 && h('section', { className: 'team-section' },
          h('h2', { className: 'section-title' }, 'Nasz zespol'),
          h('div', { className: 'team-grid' },
            team.map((member, index) => {
              const name = member.get('name') || '';
              const role = member.get('role') || '';
              const bio = member.get('bio') || '';
              const photo = member.get('photo');

              return h('div', { key: index, className: 'team-card' },
                photo && h('div', { className: 'team-photo-wrapper' },
                  h('img', {
                    src: getImageUrl(photo),
                    alt: name,
                    className: 'team-photo'
                  })
                ),
                h('div', { className: 'team-info' },
                  h('h3', { className: 'team-name' }, name),
                  h('p', { className: 'team-role' }, role),
                  bio && h('p', { className: 'team-bio' }, bio)
                )
              );
            })
          )
        ),

        // Body content
        body && h('div', { className: 'about-content' }, body)
      )
    );
  }
});

// ============================================================
// CONTACT PAGE PREVIEW TEMPLATE
// ============================================================
const ContactPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Kontakt';
    const description = entry.getIn(['data', 'description']) || '';
    const contactInfo = entry.getIn(['data', 'contact_info']);
    const mapData = entry.getIn(['data', 'map']);
    const body = this.props.widgetFor('body');

    const address = contactInfo ? contactInfo.get('address') : '';
    const phone = contactInfo ? contactInfo.get('phone') : '';
    const email = contactInfo ? contactInfo.get('email') : '';
    const hours = contactInfo ? contactInfo.get('hours') : '';

    return h('div', { className: 'preview-container' },
      // Page header
      h('div', { className: 'page-header' },
        h('div', { className: 'container' },
          h('h1', { className: 'page-title' }, title),
          description && h('p', { className: 'page-description' }, description)
        )
      ),

      // Main content
      h('div', { className: 'container' },
        h('div', { className: 'contact-page' },
          // Contact info cards
          h('div', { className: 'contact-grid' },
            // Address
            address && h('div', { className: 'contact-card' },
              h('div', { className: 'contact-icon' },
                h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                  h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
                  h('circle', { cx: '12', cy: '10', r: '3' })
                )
              ),
              h('h3', { className: 'contact-card-title' }, 'Adres'),
              h('p', { className: 'contact-card-value' }, address)
            ),

            // Phone
            phone && h('div', { className: 'contact-card' },
              h('div', { className: 'contact-icon' },
                h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                  h('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
                )
              ),
              h('h3', { className: 'contact-card-title' }, 'Telefon'),
              h('p', { className: 'contact-card-value' }, phone)
            ),

            // Email
            email && h('div', { className: 'contact-card' },
              h('div', { className: 'contact-icon' },
                h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                  h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
                  h('polyline', { points: '22,6 12,13 2,6' })
                )
              ),
              h('h3', { className: 'contact-card-title' }, 'Email'),
              h('p', { className: 'contact-card-value' }, email)
            ),

            // Hours
            hours && h('div', { className: 'contact-card' },
              h('div', { className: 'contact-icon' },
                h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                  h('circle', { cx: '12', cy: '12', r: '10' }),
                  h('polyline', { points: '12 6 12 12 16 14' })
                )
              ),
              h('h3', { className: 'contact-card-title' }, 'Godziny otwarcia'),
              h('p', { className: 'contact-card-value', style: { whiteSpace: 'pre-line' } }, hours)
            )
          ),

          // Map placeholder
          mapData && h('div', { className: 'map-section' },
            h('div', { className: 'map-placeholder' },
              h('svg', { width: '48', height: '48', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
                h('circle', { cx: '12', cy: '10', r: '3' })
              ),
              h('p', {}, 'Mapa bedzie wyswietlana tutaj')
            )
          ),

          // Body content
          body && h('div', { className: 'contact-content' }, body)
        )
      )
    );
  }
});

// ============================================================
// HOMEPAGE PREVIEW TEMPLATE
// ============================================================
const HomepagePreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Strona glowna';
    const description = entry.getIn(['data', 'description']) || '';
    const body = this.props.widgetFor('body');

    return h('div', { className: 'preview-container' },
      // Hero section mockup
      h('div', { className: 'hero-section' },
        h('div', { className: 'container' },
          h('div', { className: 'hero-content' },
            h('h1', { className: 'hero-title' }, title),
            description && h('p', { className: 'hero-subtitle' }, description)
          )
        )
      ),

      // Main content
      body && h('div', { className: 'container' },
        h('div', { className: 'homepage-content' }, body)
      ),

      // Info note
      h('div', { className: 'preview-info' },
        h('p', {}, 'Uwaga: Podglad strony glownej pokazuje podstawowe elementy. Pelna strona zawiera dodatkowe sekcje konfigurowane w innych plikach.')
      )
    );
  }
});

// ============================================================
// REGISTER PREVIEW TEMPLATES
// ============================================================

// News previews (Polish and English)
CMS.registerPreviewTemplate('news_pl', NewsPreview);
CMS.registerPreviewTemplate('news_en', NewsPreview);

// Page previews
CMS.registerPreviewTemplate('pages_pl', PagePreview);
CMS.registerPreviewTemplate('pages_en', PagePreview);

// Gallery previews
CMS.registerPreviewTemplate('gallery_pl', GalleryPreview);
CMS.registerPreviewTemplate('gallery_en', GalleryPreview);

// Program previews
CMS.registerPreviewTemplate('programs_pl', ProgramPreview);
CMS.registerPreviewTemplate('programs_en', ProgramPreview);

// Static pages (About, Contact)
CMS.registerPreviewTemplate('static_pages_pl', AboutPreview);
CMS.registerPreviewTemplate('static_pages_en', AboutPreview);

// Homepage previews
CMS.registerPreviewTemplate('homepage_pl', HomepagePreview);
CMS.registerPreviewTemplate('homepage_en', HomepagePreview);

// Program overview pages
CMS.registerPreviewTemplate('programs_overview_pl', PagePreview);
CMS.registerPreviewTemplate('programs_overview_en', PagePreview);

console.log('Wesole Nutki CMS preview templates loaded successfully');
